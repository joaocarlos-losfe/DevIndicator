import axios from "axios";
import { useEffect, useState } from "react";
import { settings } from "../configs/settings";

export function useFetch(url_api_route)
{
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true)

    const a = "joao"
    const b = "carlos"

    useEffect(()=>
    {
        const getItems = async () =>
        {
            const result = await axios.get(`${settings.localhost}/${url_api_route}`);

            setData(result.data);
            setLoading(false)
        }

        getItems()
    }, []);

    return { data, isLoading }
}