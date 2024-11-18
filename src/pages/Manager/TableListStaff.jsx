import { Button, Popconfirm, Table, Tag } from "antd";
import { 
    EditOutlined, 
    DeleteOutlined, 
    UserOutlined 
  } from '@ant-design/icons';
const StaffTable = ({ data, loading, onEdit, onDelete }) => {
    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            align: 'right',
            render: (text, record, index) => index + 1
          },
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (avatar) => (
          <img 
            src={avatar} 
            alt="Avatar" 
            style={{ width: 40, height: 40, borderRadius: '50%' }} 
          />
        ),
      },
      {
        title: 'Họ và tên',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Vị trí',
        dataIndex: 'position',
        key: 'position',
        render: (position) => (
          <Tag color={getPositionColor(position)}>
            {position}
          </Tag>
        ),
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'contact',
        key: 'contact',
      },
      {
        title: 'Nhân viên',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title:'CCCD',
        dataIndex:'cid',
        key: 'cid'
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>
            {status}
          </Tag>
        ),
      },
      {
        key: 'actions',
        width: 150,
        render: (text, record) => (
          <div>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
              style={{ marginRight: 8 }}
            >
            </Button>
            <Popconfirm
              title="Bạn có muốn xóa nhân viên này không?"
              onConfirm={() => onDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
              >
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ];
  
    const getPositionColor = (position) => {
      const colorMap = {
        'Manager': 'purple',
        'Chef': 'volcano',
        'Waiter': 'blue',
        'Bartender': 'green',
      };
      return colorMap[position] || 'default';
    };
  
    return (
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    );
  };
  export default StaffTable;