import React, { useState, useEffect } from "react";
import { List, Pagination, Spin } from "antd";

const BookingList = ({ phone_number }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchData = async (page, size) => {
        setLoading(true);
        try {
            // Gọi API để lấy dữ liệu
            // const response = await fetch(
            //     `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${size}`
            // );
            // const totalCount = response.headers.get("x-total-count");
            // const result = await response.json();
            setData(result);
            setTotal(parseInt(totalCount, 10));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchData(page, pageSize);
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, []);

    return (
        <div>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={item.body}
                            />
                        </List.Item>
                    )}
                />
            )}
            <Pagination
                align="center"
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                onShowSizeChange={handlePageChange}
                style={{ marginTop: "20px", textAlign: "center" }}
            />
        </div>
    );
};

export default BookingList;
