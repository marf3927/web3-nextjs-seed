import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';

class WithdrawInputComp extends React.Component {
	onInputChangeHandle = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.onSubmit(values);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Form layout="vertical" onSubmit={this.onInputChangeHandle} style={{ marginTop: 32 }}>
				<Form.Item>{getFieldDecorator('amount', {})(<Input placeholder="Amount" />)}</Form.Item>

				<Form.Item>
					{getFieldDecorator('address', {})(<Input placeholder="Address" />)}
				</Form.Item>

				<Form.Item>
					<Button htmlType="submit">WIRHDRAW</Button>
				</Form.Item>
			</Form>
		);
	}
}

const WithdrawInput = Form.create()(WithdrawInputComp);

export default WithdrawInput;
