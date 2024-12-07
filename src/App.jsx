import './App.css'
import React, {useEffect, useRef, useState} from 'react'
import './workFlow.css'
import {Graph} from "@antv/x6";
import { UserOutlined } from '@ant-design/icons';
import {Dnd} from "@antv/x6-plugin-dnd";
import {register} from '@antv/x6-react-shape'
import {Button, message, Spin} from 'antd';
import CreateNode from './node/createNode'
import ChatNode from './node/chatNode'
import EndNode from './node/endNode'
function App() {
    
    const containerRef = useRef(null);
    const [graph, setGraph] = useState(null);
    const [drawerDnd, setDrawerDnd] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [actuatoList, setActuatoList] = useState([]);
    const [outputList, setOutputList] = useState([]);
    const [triggerList, setTriggerList] = useState([]);
    const [spinning, setSpinning] = useState(false);
    
    // 自定义链接桩格式
    const nodeGroups = {
        groups: {
            // 输入链接桩群组定义
            left: {
                position: 'left', //定义连接柱的位置，如果不配置，将显示为默认样式
                label: {
                    position: 'right', //定义标签的位置
                },
                attrs: {   //定义连接柱的样式
                    circle: {
                        r: 10,   //半径
                        magnet: true,
                        stroke: '#1677ff99',
                        strokeWidth: 2,
                        fill: '#1677ff66',
                    },
                },
            },
            // 输入链接桩群组定义
            right: {
                position: 'right', //定义连接柱的位置，如果不配置，将显示为默认样式
                label: {
                    position: 'left', //定义标签的位置
                },
                attrs: {   //定义连接柱的样式
                    circle: {
                        r: 10,   //半径
                        magnet: true,
                        stroke: '#1677ff99',
                        strokeWidth: 2,
                        fill: '#1677ff66',
                    },
                },
            },
        }
    };
    
    useEffect(() => {
        if (!graph) {
            // 画布初始化
            const newGraph = new Graph({
                container: containerRef.current,
                snapline: true, // 对齐线
                panning: true,
                mousewheel: true,
                connecting: {
                    highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点
                    allowBlank: false, // 是否允许连接到画布空白位置的点
                    allowPort: true, // 是否允许边连接到连接桩
                    allowNode: false, // 是否允许边连接到节点（非节点上的连接桩）
                    allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
                    allowEdge: false, // 是否允许边连接到另一个边
                    allowMulti: false, // 是否允许在相同的起始节点和终止之间创建多条边
                    connector: {
                        name: 'smooth',
                        args: {
                            radius: 5,
                        },
                    },
                },
                autoResize: true,
                background: {
                    color: '#f2f7fa', // 设置画布背景颜色
                },
                grid: {
                    visible: true,
                    type: 'mesh',
                    args: [
                        {
                            color: '#ddd', // 主网格线颜色
                            thickness: 0.5, // 主网格线宽度
                        },
                        // {
                        //     color: '#f5f5f52b', // 次网格线颜色
                        //     thickness: 1, // 次网格线宽度
                        //     factor: 2, // 主次网格线间隔
                        // },
                    ],
                },
            });
            
            // 自定义节点注册
            register({
                shape: 'Trigger',
                width: 220,
                height: 120,
                effect: ['data'],
                ports: nodeGroups,
                component: CreateNode,
            })
            register({
                shape: 'Actuator',
                width: 220,
                height: 120,
                effect: ['data'],
                ports: nodeGroups,
                component: ChatNode,
            })
            register({
                shape: 'Output',
                width: 220,
                height: 120,
                effect: ['data'],
                ports: nodeGroups,
                component: EndNode,
            })
            
            // 拖拽部分初始化
            const dnd = new Dnd({
                target: newGraph,
            });
            setGraph(newGraph);
            setDrawerDnd(dnd);
        }
        
        // 模拟数据
        setTriggerList([{
            canvas_app_id: 1,
            canvas_app_name: '测试1',
            canvas_form: '[{"control_type": "input","label":"测试1"}]'
        },{
            canvas_app_id: 2,
            canvas_app_name: '测试2',
            canvas_form: '[{"control_type": "select","select_params":["1","2"],"label":"测试2"}]'
        }])
        
        setActuatoList([{
            canvas_app_id: 1,
            canvas_app_name: '测试1',
            canvas_form: '[{"control_type": "input","label":"测试1"}]'
        },{
            canvas_app_id: 2,
            canvas_app_name: '测试2',
            canvas_form: '[{"control_type": "select","select_params":["1","2"],"label":"测试2"}]'
        }])
        
        setOutputList([{
            canvas_app_id: 1,
            canvas_app_name: '测试1',
            canvas_form: '[{"control_type": "input","label":"测试1"}]'
        },{
            canvas_app_id: 2,
            canvas_app_name: '测试2',
            canvas_form: '[{"control_type": "select","select_params":["1","2"],"label":"测试2"}]'
        }])
        //const user_id = localStorage.getItem('userId');
        // getNodeList({user_id}).then((res) => {
        //     setActuatoList(res.data.actuato_result);
        //     setOutputList(res.data.output_result)
        //     setTriggerList(res.data.trigger_result)
        // })
        
    }, []);
    
    // 创建输入节点
    const createStartNode = (e, item) => {
        
        // 该 node 为拖拽的节点，默认也是放置到画布上的节点，可以自定义任何属性
        const node = graph.createNode({
            width: 220,
            height: 120,
            shape: 'Trigger',
            data: {
                title: item.canvas_app_name,
                canvas_app_id: item.canvas_app_id,
                canvas_form: JSON.parse(item.canvas_form)
            },
            ports: [
                {
                    id: 'startPort1',
                    group: 'right',
                    // attrs: {
                    //     text: {
                    //         text: '输出',
                    //     },
                    // },
                }
            ],
        });
        drawerDnd.start(node, e.nativeEvent);
    }
    
    // 创建处理节点
    const createChatNode = (e, item) => {
        // if(checkNodes('chatNode')){
        //     messageApi.info('当前已存在此节点');
        //     return
        // }
        // 该 node 为拖拽的节点，默认也是放置到画布上的节点，可以自定义任何属性
        const node = graph.createNode({
            width: 220,
            height: 120,
            shape: 'Actuator',
            data: {
                title: item.canvas_app_name,
                canvas_app_id: item.canvas_app_id,
                canvas_form: JSON.parse(item.canvas_form)
            },
            ports: [
                {
                    id: 'chatPort1',
                    group: 'left',
                    attrs: {
                        // text: {
                        //     text: '输入',
                        // },
                    },
                },
                {
                    id: 'chatPort2',
                    group: 'right',
                    // attrs: {
                    //     text: {
                    //         text: '输出',
                    //     },
                    // },
                },
            ],
        });
        drawerDnd.start(node, e.nativeEvent);
    }
    
    // 创建结束节点
    const createEndNode = (e, item) => {
        const node = graph.createNode({
            width: 220,
            height: 120,
            shape: 'Output',
            data: {
                title: item.canvas_app_name,
                canvas_app_id: item.canvas_app_id,
                canvas_form: JSON.parse(item.canvas_form)
            },
            ports: [
                {
                    id: 'endPort1',
                    group: 'left',
                    // attrs: {
                    //     text: {
                    //         text: '输入',
                    //     },
                    // },
                }
            ],
        });
        drawerDnd.start(node, e.nativeEvent);
        
    }
    
    // 检查当前节点
    const checkNodes = (name) => {
        for (const item of graph.getNodes()) {
            if (item.shape === name) {
                return true
            }
        }
        return false
    }
    
    // 清空链接柱
    const clearEdge = () => {
        for (const item of graph.getEdges()) {
            graph.removeEdge(item)
        }
    }
    
    
    // 递归获取子节点
    // const setWorkFlowData = (node, sort) =>{
    //     const workFlowData = [];
    //     const newSort = sort +1 ;
    //     const childNode = graph.getNeighbors(node,{outgoing: true});
    //     if(childNode && childNode.length){
    //         for(const item of childNode){
    //             workFlowData.push(
    //                 {
    //                     config_type: item.shape,
    //                     sort: newSort,
    //                     node_id: item.id,
    //                     application_id: idMap[item.shape],
    //                     value: item.getData()
    //                 }
    //             )
    //             workFlowData.push(...setWorkFlowData(item, newSort))
    //         }
    //     }
    //     return workFlowData
    // }
    
    
    // 创建工作流
    const addWorkFlow = () => {
        setSpinning(true);
        //const workFlowData = [];
        const workflow_info = [];
        
        // 遍历所有节点获取父子级数据
        for (const item of graph.getNodes()) {
            console.log(item.getData())
            // if(!item.getData().select_id){
            //     messageApi.info('请先配置机器人');
            //     return
            // }
            const workFlowData = {
                app_type: item.shape,
                app_id: {
                    ...item.getData().formData,
                    canvas_app_id: item.getData().canvas_app_id,
                },
                parent_app: [],
                child_app: []
            }
            const parentNodeList = graph.getNeighbors(item, {incoming: true})
            const parent_app = [];
            for (const parentNode of parentNodeList) {
                // if(!parentNode.getData().select_id){
                //     messageApi.info('请先配置机器人');
                //     return
                // }
                parent_app.push({
                    canvas_app_id: parentNode.getData().canvas_app_id,
                    ...parentNode.getData().formData,
                })
            }
            const childNodeList = graph.getNeighbors(item, {outgoing: true})
            const child_app = [];
            for (const childNode of childNodeList) {
                // if(!childNode.getData().select_id){
                //     messageApi.info('请先配置机器人');
                //     return
                // }
                child_app.push({
                    canvas_app_id: childNode.getData().canvas_app_id,
                    ...childNode.getData().formData,
                })
            }
            workFlowData.parent_app = parent_app;
            workFlowData.child_app = child_app;
            
            workflow_info.push(workFlowData);
        }
        
        // 遍历根节点进行判断和取值
        // for(const item of graph.getRootNodes()){
        //     workFlowData.push({
        //         config_type: item.shape,
        //         sort: 1,
        //         node_id: item.id,
        //         application_id: idMap[item.shape],
        //         value: item.getData()
        //     })
        //     workFlowData.push(...setWorkFlowData(item, 1));
        //     switch(item.shape){
        //         case 'startNode':  params.start = item.getData().value; break;
        //         case 'chatNode':  params.chat = item.getData().value; break;
        //         case 'endNode':  params.end = item.getData().value; break;
        //     }
        // }
        // if(!params.start.value || !params.chat.value || !params.end.value){
        //     messageApi.info('请先创建所有节点');
        //     return
        // }
        // 进行去重，条件为节点id和sort都一致
        // const work_flow_data = workFlowData.reduce((acc, cur) => {
        //     const isDuplicate = acc.some(item => item.node_id === cur.node_id && item.sort === cur.sort);
        //     if (!isDuplicate) {
        //         acc.push(cur);
        //     }
        //     return acc;
        // }, []);
        // if(!work_flow_data.length){
        //     messageApi.info('请先创建起始节点');
        //     return
        // }
        const user_id = localStorage.getItem('userId');
        if (!workflow_info.length) {
            messageApi.info('请先创建起始节点');
            setSpinning(false);
            return
        }
        // const params = {
        //     user_id,
        //     canvas_info: graph.toJSON(),
        //     workflow_info,
        //     // work_flow_data
        // }
        // if (location.state && location.state[1]) {
        //     params.canvas_workflow_id = location.state[1];
        // }
        // createWorkFlow(params).then((res) => {
        //     setSpinning(false);
        //     messageApi.success('操作成功');
        //     if(!location.state){
        //         navigate('/brainDumpWorkSpace/workFlow');
        //     }
        // });
        setTimeout(()=>{
            setSpinning(false);
            messageApi.success('操作成功');
        },1000)
      
    }
    
    
    return (
        <div className='drawer-back'>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <div className='drawer-box' style={{borderLeft: '1px solid #e6ebed'}}>
                <div className='drawer-title'>触发器</div>
                {
                    triggerList.map((item) => {
                        return (
                            <div onMouseDown={(e) => {createStartNode(e, item)}} className='drawer-card' key={item.canvas_app_id}>
                                <div style={{display: 'flex'}}>
                                    <UserOutlined style={{color: '#1677ff', fontSize: 20}}/>
                                    <div className='drawer-card-title'>{item.canvas_app_name}</div>
                                </div>
                                <div className='drawer-card-content'>
                                    {item.canvas_app_id}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            
            <div className='drawer-content'>
                <div ref={containerRef} className='drawer-x6'></div>
                <div className='drawer-footer'>
                    <div className='drawer-title' style={{marginLeft: 20}}>
                        执行器
                        <div style={{marginLeft: 'auto', marginRight: 20}}>
                            <Button onClick={addWorkFlow} type='primary' style={{marginRight: 5}}>保存</Button>
                            <Button danger onClick={clearEdge} >清空链接柱</Button>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        {
                            actuatoList.map((item) => {
                                return (
                                    <div onMouseDown={(e) => {createChatNode(e, item)}} className='drawer-card'
                                         style={{width: 200, marginLeft: 20}} key={item.canvas_app_id}>
                                        <div style={{display: 'flex'}}>
                                            <UserOutlined style={{color: '#1677ff', fontSize: 20}}/>
                                            <div className='drawer-card-title'>{item.canvas_app_name}</div>
                                        </div>
                                        <div className='drawer-card-content'>
                                            {item.canvas_app_id}
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                </div>
            </div>
            <div className='drawer-box' style={{marginLeft: 'auto'}}>
                <div className='drawer-title'>输出器/展示器</div>
                {
                    outputList.map((item) => {
                        return (
                            <div onMouseDown={(e) => {createEndNode(e, item)}} className='drawer-card' key={item.canvas_app_id}>
                                <div style={{display: 'flex'}}>
                                    <UserOutlined style={{color: '#1677ff', fontSize: 20}}/>
                                    <div className='drawer-card-title'>{item.canvas_app_name}</div>
                                </div>
                                <div className='drawer-card-content'>
                                    {item.canvas_app_id}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default App
