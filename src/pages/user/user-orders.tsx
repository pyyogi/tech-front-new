import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "./user-orders.css";

interface Order {
    id: number;
    user: User;
    sumPrice: number;
}

interface User {
    id: number;
    username: string;
}

export function UserOrders() {
    const [orders, setOrders] = useState(Array<Order>);
    const {username} = useParams();
    const redirect = useNavigate();
    const [sortDirect, setSortDirect] = useState("ascending");

    React.useEffect(() => {
        const res = axios({
            method: 'get',
            url: `http://localhost:8080/users/${username}/orders`,
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}`},
        })
        res.then((res) => {
            setOrders(res.data);
        }).catch((e) => redirect('/auth'))
    }, [username])

    const sort = (value: string) => {
        setOrders((state) => [...state.sort((a: any, b: any) => {
            if (a[value] > b[value]) return sortDirect ==='ascending' ? 1 : -1
            if (a[value] < b[value]) return sortDirect ==='ascending' ? -1 : 1
            return 0
        })])
    }

    const requestSort = (value: string) => {
        setSortDirect(sortDirect==='ascending' ? 'descending' : 'ascending')
        sort(value);
    }


    return (
        <div>
            {/*<h1>Orders</h1>*/}
            <h1>Количество заказов: {orders.length}</h1>
            <div className={"center"}>
                <table className={'border-2 mt-4'}>
                    <thead>
                    <tr>
                        <th >
                            <button type="button" onClick={() => requestSort('id')}>
                                Номер заказа
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('sumPrice')}>
                                Сумма
                            </button></th>
                        <th >Детали</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order: Order) => (
                        <tr key={order.id}>
                            <td>{order.id} </td>
                            <td>{order.sumPrice} ₽</td>
                            <td key={order.id} onClick={() => redirect(`/users/${username}/orders/${order.id}`)}>Смотреть детали...
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
