import React, { useEffect, useRef, useState } from 'react';

import { useCaver } from '../hooks/useCaver';
import JSONPretty from 'react-json-pretty';
import { JsonContainer } from '../components/PrettyJson.style';
import axios from 'axios';
import DepositInput from '../components/DepositInput';
import WithdrawInput from '../components/WithdrawInput';
import TransferInput from '../components/TransferInput';
import { Button, Divider, Col, PageHeader, Row, Typography } from 'antd';
const { Title, Text } = Typography;

// pages/index.jsimport getConfig from 'next/config'
import getConfig from 'next/config';
import basicStyle from '../components/basicStyle';
// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();


function deposit ({contract, amount, from}){
	return contract.method.deposit(amount).send({from, gas : '300000'})
}

function withdraw({contract, amount, from }) {
	return contract.method.withdraw(amount).send({from, gas : '300000'})
}

function transfer({contract, to, amount, from}) {
	return contract.method.transfer(to, from, amount).send({from, gas : '300000'})
}

function getBalance({contract, from}) {
	return contract.method.getBalance(from).call()
}

const MARFBank = ({ privateKey, abi, contractAddress }) => {
	const context = useCaver();

	const { account, contract, provider } = context.initializeWithContract({
		privateKey,
		abi,
		contractAddress
	});

	const [lastTransaction, setLastTransaction] = useState({});

	async function onSubmit(values) {
		console.log('onSubmit');
		if (context === null) {
			alert('No provider');
			return;
		}

		const { toPeb } = context.getUtils();

		const { name, address } = values;
		const transaction = await deposit({
			contract,
			name,
			address,
			from: account.address
		});

		setLastTransaction(transaction);
	}

	const {rowStyle, colStyle, gutter} = basicStyle;


	return (
		<>
			<div style={{ paddingTop: 24 }}>
				<Title>MARF Bank</Title>
				<Text>Account: {account.address}</Text>
				<br />
				<Text>Contract Address: {contractAddress}</Text>
				<br />
			</div>

			<Divider />
			<Row style={rowStyle} gutter={gutter}>
				<Col style={colStyle} span={8}>
					<h3>DEPOSIT</h3>
					<DepositInput onSubmit={onSubmit} />
				</Col>
				<Col style = {colStyle} span = {8}>
					<h3>WITHDRAW</h3>
					<WithdrawInput onSubmit={onSubmit} />
				</Col>
				<Col style = {colStyle} span = {8}>
					<h3>TRANSFER</h3>
					<TransferInput onSubmit={onSubmit} />
				</Col>
			</Row>
			<Divider />

			<JsonContainer>
				<Title level={2}>Last Transaction</Title>
				<JSONPretty data={lastTransaction} />
			</JsonContainer>
		</>
	);
};

MARFBank.getInitialProps = async ({ pathname }) => {
	console.log('MARFBank::getInitialProps', pathname);
	console.log('MARFBank::getInitialProps::serverRuntimeConfig', serverRuntimeConfig);

	const privateKey = serverRuntimeConfig.KLAYTN_PRIVATE_KEY;
	const abi = await axios.get(serverRuntimeConfig.CONTRACT_ABI_JSON).then(res => {
		return res.data;
	});

	const { contractAddress } = await axios
		.get(serverRuntimeConfig.CONTRACT_ADDRESS_JSON)
		.then(res => res.data);

	return { privateKey, abi, contractAddress };
};

export default MARFBank;
