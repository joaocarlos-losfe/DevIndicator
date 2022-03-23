import { settings } from "../../configs/settings"
import { Card } from "../../components/Card"
import { Loading } from "../../components/Loading"
import "./style.css"

import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import { useEffect, useState } from "react"
import { SearchBar } from "../../components/SearchBar"
import axios from "axios"

export function Posts()
{
    const [swapPage, setSwapPage] = useState(1); let pageNumber = swapPage;
    const [data, setPost] = useState(null);
    const [isLoading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("");
    const [filterText, setfilterText] = useState("todos");
    
    function reloadPosts()
    {
        setLoading(true);
        axios.get(`${settings.localhost}/post/${pageNumber}`).then((response) => 
        {
            setPost(response.data);
        }).finally(()=> setLoading(false));
    }

    useEffect(() => reloadPosts(), []);

    function decrementPage()
    {
        if(swapPage > 1)
        {
            setSwapPage(swapPage - 1);
            pageNumber = swapPage - 1;
            reloadPosts();
        }
    }

    function incrementPage()
    {
        if(swapPage != data.totalpages)
        {
            setSwapPage(swapPage + 1)
            pageNumber = swapPage + 1
            reloadPosts();
        }
    }

    const handleSubmit = ({searchValue, filterValue}) =>
    {
        setSearchText(searchValue);
        setfilterText(filterValue);

        console.log({searchText, filterText});
    }

    return(
        <div className="Posts">
            <div className="SearchArea">
                <SearchBar 
                onSubmit={handleSubmit}
                />
                </div>
            {
                isLoading ? <Loading/> :
                <>
                    <h2>Sugeridos</h2>
                    <div className="Cards">
                        {
                            data.posters.map((item) =>
                            {
                                return <Card id={item.__id} 
                                        category={item.category}
                                        post_date={item.post_date}
                                        username={item.username}
                                        title={item.title}
                                        description={item.description}
                                        source_url={item.source_url}
                                        />
                            })
                        }
                    </div>
                    
                    <div className="swapPages">
                        <FaChevronLeft className="btn" id="incrementPagerement" onClick={decrementPage} />
                        <h3>{`página ${swapPage} de ${data.totalpages}`}</h3>
                        <FaChevronRight className="btn" id="decrementPagerement" onClick={incrementPage}/>
                    </div>
                    
                </>
            }
        </div>
    )
} 