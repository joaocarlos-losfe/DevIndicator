const router = require('express').Router();
const PostModel = require('../models/post');
const { getCurrentTime } = require('../utils/formated_datetime');

router.get("/:page", async (req, res) => 
{
    try
    {
        console.log('request posts...');
        const page = parseInt(req.params.page);
        const maxData = 8
        const posters = await PostModel.find({}).skip(page > 0 ? ((page -1) * maxData) : 0).limit(maxData);
        const count = await PostModel.count({})
        res.status(200).json({posters, totalpages: (Math.ceil((count / maxData)))});

    }catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
}); 

router.get("/by_user/:user_name", async (req, res) => 
{
    try
    {
        const posters_by_user = await PostModel.find({username: req.params.user_name});
        res.status(200).json({data: posters_by_user});
            
    }catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
}); 

router.get("/search/:filter", async (req, res) =>
{
    try
    {
        const posters_by_filter = await PostModel.find(
            {
                $or:[
                        {tags: {$in:[req.params.filter]}}, 
                        {username: req.params.filter}, 
                        {category: req.params.filter},
                        {title: req.params.filter}
                    ]
            });
        res.status(200).json({data: posters_by_filter});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/add", async (req, res) =>
{
    try
    {
        if(req.body.username && req.body.category && req.body.tags && req.body.title && req.body.description && req.body.source_url)
        {
            //verificar antes se ja existe um post com mesmo link ou titulo ou texto iguais. 
            //Deve-se rejeitar a operação
            
            let {username, category, tags, title, description, source_url} = req.body;

            tags = tags.split(';');

            const post_date = getCurrentTime();
            const post = { username, post_date, category, tags, title, description, source_url} //validar antes

            await PostModel.create(post);
            res.status(201).json({menssage: "post inserido com sucesso"});
        }
        else
            res.status(422).json({menssage: "alguns campos estão faltando ou invalidos !"});

    }catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
    
});



module.exports = router;