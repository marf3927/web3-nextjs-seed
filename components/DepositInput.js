import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';

class DepositInputComp extends React.Component {
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
				<Form.Item label="Amount">
					{getFieldDecorator('amount', {
						initialValue: 0.01
					})(
						<InputNumber
							min={0.01}
							max={1.0}
							step={0.01}
							style={{ width: '100%' }}
							placeholder="Amount"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
						DEPOSIT
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

const DepositInput = Form.create()(DepositInputComp);

export default DepositInput;
