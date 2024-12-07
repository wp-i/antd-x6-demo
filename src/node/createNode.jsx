import React, {useEffect, useState} from 'react'
import { Node } from '@antv/x6'
import {CloseOutlined, UserOutlined} from '@ant-design/icons';
import { Select, Form, Input } from 'antd';
import './index.css'

export default function CreateNode({ node }) {
    const nodeData = node.getData();
    const [form] = Form.useForm();
    const [formItemList, setFormItemList] = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            const newData = [...nodeData.canvas_form]
            for(const item of newData){
                if(item.control_type === 'select' && (item.sort == '1' || !item.sort)){
                    const params = {...item.select_params[0]}
                    params.user_id = localStorage.getItem('userId');
                    // await getSelectDataBase(params).then((res)=>{
                    //     item.optionList = res.data.result.map((ele)=>({
                    //         ...ele,
                    //         sort: 1,
                    //         name: item.name
                    //     }));
                    // })
                    item.optionList = [{label: 'a', value: 1},{label: 'b', value: 0}];
                }
            }
            setFormItemList(newData);
        }
        fetchData();
    },[])

    const onFormChange = (changedValues, allValues) =>{
        node.setData({formData: allValues})
    }

    // 更新下拉数据源
    const updateSelectData = async (sort, key, value) =>{

        const newData = [...formItemList]
        for(const item of newData){
            if(item.control_type === 'select' && item.sort == sort){
                const params = {...item.select_params[0]}
                params[key] = value;
                params.user_id = localStorage.getItem('userId');
                // await getSelectDataBase(params).then((res)=>{
                //     item.optionList = res.data.result.map((ele)=>({
                //         ...ele,
                //         sort,
                //         name: item.name
                //     }));
                // })
                item.optionList = [{label: 'a', value: 1},{label: 'b', value: 0}];
            }
        }
        setFormItemList(newData);
    }

    const removeNode = () =>{
        node?.remove();
    }

    return (
        <div className='node-back'>
            <div className='node-del'>
                <CloseOutlined style={{color: 'black'}} onClick={removeNode}/>
            </div>
            {/*<Select*/}
            {/*    style={{ width: 100, marginTop: 10 }}*/}
            {/*    onSelect={(value)=>{*/}
            {/*        nodeData.select_id = value;*/}
            {/*        node.setData(nodeData)*/}
            {/*    }}*/}
            {/*    fieldNames={fieldNames}*/}
            {/*    value={nodeData.select_id}*/}
            {/*    options={optionList}*/}
            {/*/>*/}
            <div className='node-box'>
                <Form layout='vertical' form={form} onValuesChange={onFormChange} style={{padding: '0 15px'}}>
                    {
                        formItemList.map((item)=>{
                            return (
                                <>
                                    <div className='node-header'>
                                        <UserOutlined style={{color: '#1677ff', fontSize: 20}}/>
                                        <span style={{marginLeft: 10}}>{item.label}</span>
                                    </div>
                                    <Form.Item name={item.name} >
                                        {item.control_type === 'input' ?
                                            <Input placeholder={item.label}/>:item.control_type === 'select' ?
                                                <Select placeholder='未配置' search={item.isShowSearch} className='node-select'
                                                        onChange={(value, option)=>updateSelectData(option.sort + 1,option.name, value)}
                                                        multiple={item.isMultiple}
                                                        filterOption={(input, option) => {
                                                            item.isShowSearch?(option?.label ?? '').toLowerCase().includes(input.toLowerCase()):''
                                                        }}
                                                        fieldNames={item.field_name}
                                                        options={item.optionList}/>:<></>}
                                    </Form.Item>
                                </>
                            )
                        })
                    }
                </Form>
            </div>
        </div>
    )
}
