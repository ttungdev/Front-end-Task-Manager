import React, { useState } from 'react';
import axios from 'axios'
import { Button, Table, Form, message, Space, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Input from 'antd/es/input';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal';

type Props = {}


// Using back-end API to catch data
const API_URL = 'http://localhost:9000';



export default function Manager({ }: Props) {
    const [manager, setManager] = React.useState<any[]>([]);
    const [refresh, setRefresh] = React.useState<number>(0);
    const [open, setOpen] = React.useState<boolean>(false);
    const [updateId, setUpdateId] = React.useState<number>(0);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [sortPriority, setSortPriority] = useState<{
        order: 'ascend' | 'descend' | null;
    }>({
        order: null,
    });


    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '1%',
            align: 'right',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: 'Task',
            dataIndex: 'task',
            key: 'task',
            render: (text, record, index) => {
                return <strong style={{ color: 'blue' }}>{text}</strong>
            },
            sorter: (a, b) => a.task.localeCompare(b.task),
        },
        {
            title: 'Tiến độ',
            dataIndex: 'process',
            key: 'process'
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            sorter: (a, b) => {
                const priorityOrder = ['High', 'Normal', 'Low'];
                return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
            },
            sortOrder: sortPriority.order,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: '1%',
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button icon={<EditOutlined />}
                            onClick={() => {
                                setOpen(true);
                                setUpdateId(record.id);
                                updateForm.setFieldsValue(record);
                            }}
                        />
                        <Button icon={<DeleteOutlined />}
                            danger
                            onClick={() => {
                                console.log(record.id);
                                axios.delete(API_URL + '/' + record.id).then((response) => {
                                    setRefresh(f => f + 1);
                                    message.success('Xóa thành công', 1);
                                }).catch(err => {
                                    console.log(err);
                                })
                            }}
                        />
                    </Space>
                );
            },
        },
    ]

    // USE EFFECT
    React.useEffect(() => {
        // Call API
        axios.get(API_URL).then((response: any) => {
            const { data } = response;
            setManager(data)
            console.log(data);
        }).catch(err => {
            console.error(err);
        })
    }, [refresh]);


    const onChange = (pagination: any, filters: any, sorter: any) => {
        const { columnKey, order } = sorter;

        let sortedData = [...manager];
        if (columnKey === 'priority') {
            if (order === 'ascend') {
                sortedData.sort((a, b) => {
                    const priorityOrder = ['High', 'Normal', 'Low'];
                    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
                });
            } else if (order === 'descend') {
                sortedData.sort((a, b) => {
                    const priorityOrder = ['High', 'Normal', 'Low'];
                    return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
                });
            }
        }

        setSearchResults(sortedData);
        setSortPriority({ order: order });
    };

    const onFinish = (values: any) => {
        console.log(values);
        axios.post(API_URL, values).then(response => {
            setRefresh(f => f + 1);
            createForm.resetFields();
            message.success('Tạo mới thành công', 1);
        }).catch(err => {
            console.log(err);
        })
    };

    const onUpdateFinish = (values: any) => {
        console.log(values);
        fetch(API_URL + '/' + updateId, {
            method: 'PATCH', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setRefresh(f => f + 1);
                updateForm.resetFields();
                message.success('Cập nhật thành công', 1);
                setOpen(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // axios.post(API_URL +'/'+ updateId, values).then(response => {
        //     setRefresh(f => f + 1);
        //     updateForm.resetFields();
        //     message.success('Cập nhật thành công', 1);              // Khong hieu sao ra AxiosError
        //     setOpen(false);
        // }).catch(err => {
        //     console.log(updateId);
        //     console.log(err);
        // })
    };

    const onSearch = (value: string) => {
        const filteredData = manager.filter((item) =>
            item.task.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredData);
    };



    return (
        <div style={{ padding: 24 }}>
            <div>
                {/* TITLE */}

                <h1 style={{ display: 'flex', justifyContent: 'center' }}>Task Manager</h1>

                {/* CREATE FORM */}

                <Form
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 8,
                    }}>
                    <Form.Item label="Search">
                        <Input.Search
                            placeholder="Tìm kiếm"
                            onSearch={onSearch}
                            enterButton
                            style={{ marginBottom: '16px' }}
                        />
                    </Form.Item>

                </Form>


                <Form
                    form={createForm}
                    name='create-form'
                    onFinish={onFinish}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 8,
                    }}
                >
                    <Form.Item label='Task'
                        name='task'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Hãy nhập thông tin'
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Tiến độ'
                        name='process'
                    >
                        <Select
                            showSearch
                            placeholder="Select a process"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: 'Done',
                                    label: 'Done',
                                },
                                {
                                    value: 'In process',
                                    label: 'In process',
                                },
                                {
                                    value: 'Cancel',
                                    label: 'Cancel',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Priority"
                        name='priority'>
                        <Select
                            showSearch
                            placeholder="Select a priority"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: 'Normal',
                                    label: 'Normal',
                                },
                                {
                                    value: 'High',
                                    label: 'High',
                                },
                                {
                                    value: 'Low',
                                    label: 'Low',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>


                {/* EDIT FORM */}
                <Modal open={open} title='Cập nhật danh mục'
                    onCancel={() => setOpen(false)}
                    cancelText='Đóng'
                    okText='Lưu dữ liệu'
                    onOk={() => {
                        updateForm.submit();
                    }}>
                    <Form
                        form={updateForm}
                        name='update-form'
                        onFinish={onUpdateFinish}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        <Form.Item label='Task'
                            name='task'
                            hasFeedback
                            required={true} rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập thông tin'
                                }
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label='process'
                            name='process'
                        >
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'Done',
                                        label: 'Done',
                                    },
                                    {
                                        value: 'In process',
                                        label: 'In process',
                                    },
                                    {
                                        value: 'Cancel',
                                        label: 'Cancel',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Priority"
                            name='priority'>
                            <Select
                                showSearch
                                placeholder="Select a priority"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'Normal',
                                        label: 'Normal',
                                    },
                                    {
                                        value: 'High',
                                        label: 'High',
                                    },
                                    {
                                        value: 'Low',
                                        label: 'Low',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
            <h2 style={{ display: 'flex', justifyContent: 'center' }}>Task List</h2>
            <Table rowKey='id' dataSource={searchResults.length > 0 ? searchResults : manager} columns={columns} onChange={onChange} />
        </div >
    );
}