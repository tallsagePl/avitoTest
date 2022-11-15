import React, { useState, useEffect, FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addNews } from '~/redux/reducers/requestReducer';
import { useHistory } from 'react-router-dom';
import Loader from '~/components/Loader';

export const Feed: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchFucn;
        const intervalId = setInterval(() => {
            fetchFucn;
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchFucn = useMemo(() => {
        let fetchData: any = [];
        fetch(
            'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.map((el: any) => {
                    new Promise<void>((resolve) => {
                        fetch(
                            'https://hacker-news.firebaseio.com/v0/item/' +
                                el +
                                '.json'
                        )
                            .then((response) => {
                                return response.json();
                            })
                            .then((data: object) => {
                                if (data) {
                                    fetchData = fetchData.concat(data);
                                }
                                if (fetchData.length === 100) {
                                    resolve();
                                }
                            });
                    }).then(() => {
                        dispatch(addNews(fetchData));
                        setRefresh(true);
                        setData(fetchData);
                    });
                });
            });
    }, [refresh]);

    const handleClick = (id: string) => {
        history.push('/news?' + id);
    };

    return (
        <div>
            {!(data.length > 0) ? (
                <Loader />
            ) : (
                <div>
                    <div className="pl-10 pt-5">
                        <button
                            className="bg-gray-300 border-gray-400 border-2 p-1"
                            onClick={() => setRefresh(!refresh)}
                        >
                            <p className="hover:text-sky-400">Перезагрузить</p>
                        </button>
                    </div>
                    {data.map((el: any) => {
                        const date = new Date(el.time * 1000);
                        return (
                            <li
                                key={el.id}
                                className="bg-gray-300 border-gray-400 border-2 m-10 list-none "
                                onClick={() => {
                                    handleClick(el.id);
                                }}
                            >
                                <div className="grid gap-1 grid-cols-4 grid-rows-2">
                                    <div className="m-5 font-semibold">
                                        название
                                    </div>
                                    <div className="m-5 font-semibold">
                                        рейтинг
                                    </div>
                                    <div className="m-5 font-semibold">
                                        ник автора
                                    </div>
                                    <div className="m-5 font-semibold">
                                        дата публикации
                                    </div>
                                    <div className="m-5 ">{el.title}</div>
                                    <div className="m-5">{el.score}</div>
                                    <div className="m-5">{el.by}</div>
                                    <div className="m-5">
                                        {date.toLocaleString()}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
