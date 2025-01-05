// material-ui
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { userApi, orderApi, bookApi } from '../../apis/index';
import { HTTP_STATUS, METHOD } from '../../constants';

// project import
import MainCard from '../../components/MainCard';
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';

// assets
// import GiftOutlined from '@ant-design/icons/GiftOutlined';
// import MessageOutlined from '@ant-design/icons/MessageOutlined';
// import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from './users/avatar-1.png';
import avatar2 from './users/avatar-2.png';
import avatar3 from './users/avatar-3.png';
import avatar4 from './users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [statistics, setStatistics] = useState({});


  useEffect(() => {
    async function fetchUsers() {
      const { status, data } = await userApi.listUsers();
      if (status === HTTP_STATUS.OK) {
        setUsers(data?.data);
      }
    }
    fetchUsers();

    async function fetchOrders() {
      const { status, data } = await orderApi.listOrders();
      if (status === HTTP_STATUS.OK) {
        setOrders(data?.data);
      }
    }
    fetchOrders();

    async function fetchBooks() {
      const { status, data } = await bookApi.listbooks();
      if (status === HTTP_STATUS.OK) {
        setBooks(data?.data);
      }
    }
    fetchBooks();

    async function fetchStatistics() {
      const { status, data } = await bookApi.dashboard();
      if (status === HTTP_STATUS.OK) {
        setStatistics(data?.data);
      }
    }
    fetchStatistics();
  }, []);
  console.log('statistics', statistics);
  return (
    <div style={{ padding: '20px' }}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography style={{ fontSize: '23px', fontWeight: '600' }} variant="h5">Dashboard</Typography>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Page Views" count="4,42,236" percentage={59.3} extra="35,000" />
        </Grid> */}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <AnalyticEcommerce title="Tổng người dùng" count={statistics?.totalActiveUsers} percentage={"khách hàng"} extra="8,900" />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <AnalyticEcommerce title="Tổng đơn hàng hoàn thành" count={statistics?.totalOrders} percentage={"đơn"} isLoss color="warning" extra="1,943" />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Sales" count="$35,078" percentage={27.4} isLoss color="warning" extra="$20,395" />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng chi phí" count={statistics?.totalExpenses} percentage={'VND'} isLoss color="warning" extra="1,943" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng doanh thu" count={statistics?.totalRevenue} percentage={'VND'} isLoss color="warning" extra="1,943" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng lợi nhuận" count={statistics?.totalProfit} percentage={'VND'} isLoss color="warning" extra="1,943" />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng đầu sách" count={statistics?.totalBooks} percentage={"sách"} isLoss color="warning" extra="1,943" />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng sách đã bán" count={statistics?.totalSoldBooks} percentage={"sách"} isLoss color="warning" extra="1,943" />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <AnalyticEcommerce title="Tổng sách còn lại" count={statistics?.totalRemainingBooks} percentage={"sách"} isLoss color="warning" extra="1,943" />
        </Grid>

        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      </Grid>
    </div>
  );
}
