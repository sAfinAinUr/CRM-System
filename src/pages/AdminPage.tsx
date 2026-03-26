import { useEffect, useRef, useState } from 'react';

import { Input, Table, TableColumnsType } from 'antd';

import AdminListActions from '../components/AdminListActions.tsx';
import RoleSelect from '../components/RoleSelect.tsx';
import { useGetAdminListQuery } from '../store/index.ts';
import { User, UsersOrderType } from '../types/admin.ts';

const getColumns = (refetch: VoidFunction): TableColumnsType<User> => [
  {
    title: 'Имя',
    dataIndex: 'username',
    sorter: true
  },
  {
    title: 'Почта',
    dataIndex: 'email',
    sorter: true
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'date',
    render(value) {
      const date = new Date(value);

      return date.toLocaleDateString();
    }
  },
  {
    title: 'Статус блокировки',
    dataIndex: 'isBlocked',
    filterMode: 'menu',
    filterMultiple: false,
    filters: [
      { text: 'заблокирован', value: true },
      { text: 'активен', value: false }
    ],
    render(value) {
      return value ? 'заблокирован' : 'активен';
    }
  },
  {
    title: 'Роли',
    dataIndex: 'roles',
    key: 'roles',
    render: (_, user: User) => <RoleSelect user={user} refetch={refetch} />
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phoneNumber'
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (_, user: User) => <AdminListActions user={user} refetch={refetch} />
  }
];

export default function AdminPage() {
  const [searchText, setSearchText] = useState('');
  const [searchTextDb, setSearchTextDb] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<UsersOrderType>(undefined);
  const [isBlocked, setIsBlocked] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data, isSuccess, refetch } = useGetAdminListQuery({
    page: pagination.page - 1,
    limit: pagination.pageSize,
    search: searchTextDb,
    sortBy,
    sortOrder,
    isBlocked
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

  return (
    <>
      <Input.Search value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <Table<User>
        columns={getColumns(refetch)}
        dataSource={data.data}
        onChange={(_pagination, filters, sorter) => {
          if (Array.isArray(sorter)) return;
          if (typeof sorter.field === 'string') {
            setSortBy(sorter.field);
            setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
          } else {
            setSortBy('');
            setSortOrder(undefined);
          }
          if (typeof filters.isBlocked?.[0] === 'boolean') setIsBlocked(filters.isBlocked[0]);
          else setIsBlocked(undefined);
        }}
        pagination={{
          total: data.meta.totalAmount,
          defaultCurrent: 1,
          defaultPageSize: 20,
          pageSizeOptions: [10, 20, 30],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items `,
          onChange: (page, pageSize) => {
            setPagination({ page, pageSize });
            console.log(page, pageSize);
          }
        }}
      />
    </>
  );
}
