import React, { useState } from 'react';
import axios from 'axios'
import { Button, Table, Form, message, Space, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Input from 'antd/es/input';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal';

const { confirm } = Modal;
const { Option } = Select;

type Props = {}


// Using back-end API to catch data
const API_URL = 'https://back-end-nl6x.onrender.com/';



export default function Manager({ }: Props) {
	const [manager, setManager] = React.useState<any[]>([]);
	const [refresh, setRefresh] = React.useState<number>(0);
	const [open, setOpen] = React.useState<boolean>(false);
	const [updateId, setUpdateId] = React.useState<number>(0);
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [filterStatus, setFilterStatus] = useState<string>('');
	const [filterPriority, setFilterPriority] = useState<string>('');

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
			key: 'process',

		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
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
							name='edit'
							onClick={() => {
								setOpen(true);
								setUpdateId(record.id);
								updateForm.setFieldsValue(record);
							}}
						/>
						<Button icon={<DeleteOutlined />}
							name='delete'
							danger
							onClick={() => showDeleteConfirm(record.id)}
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

	const showDeleteConfirm = (recordId: number) => {
		confirm({
			title: 'Xác nhận xóa',
			icon: <ExclamationCircleOutlined />,
			content: 'Bạn có chắc chắn muốn xóa?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk() {
				deleteRecord(recordId);
			},
		});
	};
	const deleteRecord = (recordId: number) => {
		axios
			.delete(API_URL + '/' + recordId)
			.then((response) => {
				setRefresh((f) => f + 1);
				message.success('Xóa thành công', 1);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// FILTERS STATUS
	const onFilterStatusChange = (value: string) => {
		setFilterStatus(value);
		filterData(filterPriority, value);
	};

	const onFilterPriorityChange = (value: string) => {
		setFilterPriority(value);
		filterData(value, filterStatus);
	};

	const filterData = (priority: string, status: string) => {
		let filteredData = manager;

		if (priority !== '') {
			filteredData = filteredData.filter((item) => item.priority === priority);
		}

		if (status !== '') {
			filteredData = filteredData.filter((item) => item.process === status);
		}

		setSearchResults(filteredData);
	};


	const onChange = (pagination: any, filters: any, sorter: any) => {
		const { columnKey, order } = sorter;
		let sortedData = [...manager];

		if (order === 'ascend') {
			sortedData.sort((a, b) => (a[columnKey] > b[columnKey] ? 1 : -1));
		} else if (order === 'descend') {
			sortedData.sort((a, b) => (a[columnKey] < b[columnKey] ? 1 : -1));
		}

		setSearchResults(sortedData);
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
		axios.patch(API_URL + '/' + updateId, values).then(response => {
			setRefresh(f => f + 1);
			updateForm.resetFields();
			message.success('Cập nhật thành công', 1);
			setOpen(false);
		}).catch(err => {
			console.log(updateId);
			console.log(err);
		})
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
						<Input name='task' />
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
							<Input name='task'/>
						</Form.Item>

						<Form.Item label='process'
							name='process'
						>
							<Select
								showSearch
								placeholder="Select a process"
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
			{/* FILTER */}
			<div style={{ marginBottom: '16px' }}>
				<div style={{ marginBottom: 20 }}>
					<span style={{ marginRight: '8px' }}>Filter by status:</span>
					<Select
						value={filterStatus}
						onChange={onFilterStatusChange}
						style={{ width: 120, marginRight: '16px' }}
					>
						<Option value="">All</Option>
						<Option value="Done">Done</Option>
						<Option value="In process">In process</Option>
						<Option value="Cancel">Cancel</Option>
					</Select>
				</div>

				<div>
					<span style={{ marginRight: '8px' }}>Filter by priority:</span>
					<Select
						value={filterPriority}
						onChange={onFilterPriorityChange}
						style={{ width: 120 }}
					>
						<Option value="">All</Option>
						<Option value="Normal">Normal</Option>
						<Option value="High">High</Option>
						<Option value="Low">Low</Option>
					</Select>
				</div>

			</div>

			<h2 style={{ display: 'flex', justifyContent: 'center' }}>Task List</h2>
			<Table rowKey='id' dataSource={searchResults.length > 0 ? searchResults : manager} columns={columns} onChange={(pagination, filters, sorter) => {
				// Xử lý sự kiện thay đổi sắp xếp
				console.log(sorter);
			}} />
		</div >
	);
}