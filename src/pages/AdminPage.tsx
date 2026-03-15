import { useEffect, useRef, useState } from 'react';

import { Input, Table, TableColumnsType, TableProps } from 'antd';

import { useGetAdminListQuery } from '../store/index.ts';
import { User } from '../types/admin.ts';
import LayoutMainApp from './LayoutMainApp.tsx';

const columns: TableColumnsType<User> = [
  {
    title: 'Имя',
    dataIndex: 'username',
  },
  {
    title: 'Почта',
    dataIndex: 'email',
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'date',
    render(value) {
      const date = new Date(value);

      return date.toLocaleDateString();
    },
  },
  {
    title: 'Статус блокировки',
    dataIndex: 'isBlocked',
    render(value) {
      return value ? 'blocked' : '-';
    },
  },
  {
    title: 'Роли',
    dataIndex: 'roles',
    render(value) {
      return JSON.stringify(value, null, 2);
    },
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
  },
];

const onChange: TableProps<User>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

export default function AdminPage() {
  const [searchText, setSearchText] = useState('');
  const [searchTextDb, setSearchTextDb] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data, isSuccess } = useGetAdminListQuery({
    page: pagination.page - 1,
    limit: pagination.pageSize,
    search: searchTextDb,
  });

  useEffect(() => {
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTextDb(searchText);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchText]);

  if (!isSuccess) return null;

  console.log(data.data);

  return (
    <LayoutMainApp>
      <Input.Search value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <Table<User>
        columns={columns}
        dataSource={data.data}
        onChange={onChange}
        pagination={{
          total: data.meta.totalAmount,
          defaultCurrent: 1,
          defaultPageSize: 20,
          pageSizeOptions: [10, 20, 30],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items `,
          onChange: (page, pageSize) => {
            setPagination({ page, pageSize });
            console.log(page, pageSize);
          },
        }}
      />
    </LayoutMainApp>
  );
}
