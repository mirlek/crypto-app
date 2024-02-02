import React from 'react';
import { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import { Card, Col, Row, Statistic, List, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { fakeFetchCrypto, fetchAssets } from '../../api';
import { percentDifference } from '../../utils';

const siderStyle = {
  padding: '1rem',

};
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];


export default function AppSider() {
const [loading, setLoading] = useState(false) 
const [crypto, setCrypto] = useState(false) 
const [assets, setAssets] = useState([]) 


useEffect(() => {
  async function preload() {
    setLoading(true)
    const { result } = await fakeFetchCrypto()
    const assets = await fetchAssets()

    setAssets(
      assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id)
      return {
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        ...asset,
      }
    }))
    setCrypto(result)
    setLoading(false)
  }
  preload()
}, [])

if (loading) {
  return  <Spin fullscreen />
}

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      <Row gutter={16}>
        {assets.map((asset) => (
          <Col span={12}>
          <Card
              key={assets.id}
              bordered={false}>
            <List
                size='small'
                dataSource={data}
                renderItem={(item) => (
              <List.Item>
                <Typography.Text mark>[ITEM]</Typography.Text> {item}
              </List.Item>
                )}
            />
            <Statistic
                title={asset.id}
                value={asset.totalAmount}
                precision={2}
                valueStyle={{
                  color: asset.grow ? '#3f8600' : '#cf1322',
                }}
                prefix={ asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="$"
              />
          </Card>
      </Col>
        ))}
      </Row>
    </Layout.Sider>  
  )
}