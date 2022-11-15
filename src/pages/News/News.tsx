import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '~/components/Loader';

const Comments: FC<{
    el: any;
    byT: number;
    byL: number;
    m: number;
    ml: number;
}> = ({ el, byT, byL, m, ml }) => {
    const date = new Date(el.time * 1000);
    byT = byT + 20;
    byL = byL + 30;
    m = m + 20;
    ml = ml + 20;
    return (
        <div key={el.id}>
            <div
                className="font-semibold"
                style={{
                    marginTop: `${byT}px`,
                    marginLeft: `${byL}px`,
                }}
            >
                {el.by === '' ? '---' : el.by}
            </div>
            <div
                style={{
                    margin: `${m}px`,
                    marginLeft: `${ml}px`,
                }}
            >
                {el.text}
            </div>
            <div
                style={{
                    margin: `${m}px`,
                    marginLeft: `${ml}px`,
                }}
            >
                {date.toLocaleString()}
            </div>
            {el.kids ? (
                el.kids.map((el: any) => {
                    return (
                        <Comments
                            key={el.id}
                            el={el}
                            byT={byT}
                            byL={byL}
                            m={m}
                            ml={ml}
                        />
                    );
                })
            ) : (
                <></>
            )}
        </div>
    );
};

export const News: FC = () => {
    const history = useHistory();
    const news = useSelector((state: any) => state.news);
    const id = Number(window.location.search.slice(1));
    const arrOfId = news.map((data: any) => data.id);
    const currentNews = news[arrOfId.indexOf(id)];
    const [comments, setComments] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchCommentFucn = async (arr: any) => {
        let fetchData: any = [];

        await Promise.all(
            arr.map(async (item: string) => {
                const response = await fetch(
                    'https://hacker-news.firebaseio.com/v0/item/' +
                        item +
                        '.json'
                );

                const data = await response.json();
                const dataKids = data;
                if (data) {
                    if (data.kids) {
                        dataKids.kids = await fetchCommentFucn(data.kids);
                        fetchData = await fetchData.concat(dataKids);
                    } else {
                        fetchData = await fetchData.concat(data);
                    }
                }
            })
        );
        return await fetchData;
    };

    useEffect(() => {
        !currentNews && history.push('/feed');

        currentNews?.kids &&
            (async () => {
                setComments(await fetchCommentFucn(currentNews.kids));
            })();
    }, [refresh]);

    return (
        <div>
            {!currentNews ? (
                <Loader />
            ) : (
                <div>
                    <div className="grid gap-1 grid-cols-2 grid-rows-2">
                        <div className="m-5 font-semibold">
                            ссылка на публикацию
                        </div>

                        <div className="m-5">
                            <a
                                href={currentNews.url}
                                className="nav-link d-inline"
                                rel="noopener noreferrer"
                            >
                                {currentNews.url}
                            </a>
                        </div>
                        <div className="m-5 font-semibold">заголовок</div>
                        <div className="m-5 ">{currentNews.title}</div>
                        <div className="m-5 font-semibold">автор</div>
                        <div className="m-5">{currentNews.by}</div>
                        <div className="m-5 font-semibold">дата публикации</div>
                        <div className="m-5">
                            {new Date(currentNews.time * 1000).toLocaleString()}
                        </div>
                        <div className="m-5 font-semibold">
                            счётчик количества комментариев
                        </div>
                        <div className="m-5">
                            {comments ? comments.length : '0'}
                        </div>
                        <div>
                            <button
                                className="bg-gray-300 border-gray-400 border-2 p-1 text-xl ml-5"
                                onClick={() => setRefresh(!refresh)}
                            >
                                <p className="hover:text-sky-400">
                                    Обновить коментарии
                                </p>
                            </button>
                        </div>
                        <Link className=" text-xl m-25" to="/feed">
                            <button className="bg-gray-300 border-gray-400 border-2 p-1">
                                <p className="hover:text-sky-400">
                                    Вернуться на главную
                                </p>
                            </button>
                        </Link>
                    </div>
                    {comments ? (
                        comments.map((el: any) => {
                            return (
                                <Comments
                                    key={el.id}
                                    el={el}
                                    byT={5}
                                    byL={3}
                                    m={0}
                                    ml={0}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </div>
    );
};
