import React from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
// import { Button } from '@material-ui/core';
import {
  Button,
  Modal,
  Row,
  Col,
  Input,
} from "reactstrap";


import EmojiTransportationSharpIcon from '@material-ui/icons/EmojiTransportationSharp';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import KeyboardBackspaceSharpIcon from '@material-ui/icons/KeyboardBackspaceSharp';
import Translator from './Translator'
import {server_url} from './config/config'
import { message } from "antd";

import './css/usertable.css';

class BodyCellExample extends React.Component {
  constructor() {
    super()
    this.state = {
      columns1: [
        "会社名",
        "代表者　名前 性",
        "代表者　名前 名",
        "代表者　名前 性 かな",
        "代表者　名前 名 かな",
        "代表者込みの接続ID数",
        "メールアドレス",
        "会社電話番号",
        "状態", 
        "役割",
        "パスワード作成",
      ],
      columns2: [
        "名前 性", 
        "名前 名", 
        "名前 性 かな", 
        "名前 名 かな", 
        "メールアドレス",
        "電話番号",
        "状態",
        "役割",
        "パスワード作成", 
      ],
      options : {
        filter: true,
        filterType: "dropdown",
        responsive: "vertical",
        tableBodyHeight: "600px",
        tableBodyMaxHeight: "",
        onRowsDelete: (rowsDeleted, data) => {
          this.rowDelete(rowsDeleted, data)
        },
        // selectableRowsOnClick: () => {},
        onRowClick: (rowData, rowMeta ) => {
          this.rowEditFunc(rowData, rowMeta)
        },
      },
      data1: [],
      data2: [],
      data1t: [],
      data2t: [],
      dataType: '0',
      modalDefaultOpen : false,
      editEmail: '',
      editIndex: '',
      b1: '', b2 : '', b3 : '', b4 : '', b5 : '', b6 : '', b7 : '', b8 : '', b9 : '', b10 : '', b11 : '',
      t1: '', t2 : '', t3 : '', t4 : '', t5 : '', t6 : '', t7 : '', t8 : '', t9 : '', t10 : '', t11 : '',
    }
    this.rowDelete = this.rowDelete.bind(this)
    this.backward = this.backward.bind(this)
    this.rowEditFunc = this.rowEditFunc.bind(this)
    this.setModalDefaultOpen = this.setModalDefaultOpen.bind(this)
  }
  
  UNSAFE_componentWillMount() {
    var me = this
    axios.post(server_url + `tenji-con/loadUsers`, {type: localStorage.getItem('type') ,email: localStorage.getItem('email')})
    .then(res => {
      if(res.data.length === 0) {
        me.setState({data: {Result : "there is no users"}})
      } else {
          var data1 = res.data.filter(a => a.type === '0')
          var arr1 = []
          for(var i = 0 ; i < data1.length ; i++) {
            if(data1[i]['cEmail'] === localStorage.getItem('email'))continue;
            var lowArr = [
              data1[i]['cName'],
              data1[i]['cRepresentativeL'],
              data1[i]['cRepresentativeF'],
              data1[i]['cRepresentativeLK'],
              data1[i]['cRepresentativeFK'],
              data1[i]['cRequireNo'],
              data1[i]['cEmail'],
              data1[i]['uTel'],
              data1[i]['active'],
              data1[i]['role'],
              data1[i]['cPass'],
            ]
            arr1.push(lowArr)
          }
          me.setState({data1: arr1, data1t : arr1})
          var data2 = res.data.filter(a => a.type === '1')
          var arr2 = []
          for(var j = 0 ; j < data2.length ; j++) {
            if(data2[j]['uEmail'] === localStorage.getItem('email'))continue;
            var lowArr1 = [
              data2[j]['uLname'],
              data2[j]['uFname'],
              data2[j]['uLnameK'],
              data2[j]['uFnameK'],
              data2[j]['uEmail'],
              data2[j]['uTel'],
              data2[j]['active'],
              data2[j]['role'],
              data2[j]['uPass'],
            ]
            arr2.push(lowArr1)
          }
          me.setState({data2: arr2, data2t : arr2})
      }
    })
    this.setState({t1: this.state.columns1[0], t2 : this.state.columns1[1], t3 : this.state.columns1[2], t4 : this.state.columns1[3], t5 : this.state.columns1[4], t6 : this.state.columns1[5], t7 : this.state.columns1[6], t8 : this.state.columns1[7], t9 : this.state.columns1[8], t10 : this.state.columns1[9], t11 : this.state.columns1[10]})
  }

  rowDelete(rowsDeleted, data) {
    var RemoveEmail = []
    var maindatas = rowsDeleted['data']
    if(this.state.dataType === '0') {
      for(var i = 0 ; i < maindatas.length ; i++) {
        RemoveEmail.push(this.state.data1[rowsDeleted['data'][i]['dataIndex']][1]);
      }
      this.setState({data1: data})
    } else {
      for(var j = 0 ; j < maindatas.length ; j++) {
        RemoveEmail.push(this.state.data2[rowsDeleted['data'][j]['dataIndex']][1]);
      }
      this.setState({data2: data})
    }

    axios.post(server_url + `tenji-con/removeUser`, {emails: RemoveEmail})
    .then(res => {
      if(res.data === true) {
        message.success("Success!")
      }
    })
  }

  Company() {
    this.setState({dataType: '0'})
  }

  Individual() {
    this.setState({dataType: '1'})
  }

  backward() {
    window.history.back();
  }

  setModalDefaultOpen(flag) {
    this.setState({modalDefaultOpen: flag})
  }

  saveChangedData() {
    var changedData = null
    var flag = true
    if(this.state.dataType === '0') {
      if(this.state.b9 !== "0" && this.state.b9 !== "1") {
        message.error("The Status has to be 0 or 1");
        this.setState({b9: '1'})
        flag = false
      } else if(this.state.b10 !== "0" && this.state.b10 !== "1" && this.state.b10 !== "2") {
        message.error("The role has to be 0, 1 or 2");
        this.setState({b10: '1'})
        flag = false
      }
      if(flag === true) {
        var changedData1 = [this.state.b1, this.state.b2, this.state.b3, this.state.b4, this.state.b5, this.state.b6, this.state.b7, this.state.b8, this.state.b9,this.state.b10, this.state.b11]
        changedData = changedData1
        var chg1 = []
        for(var i  = 0 ; i < this.state.data1.length ; i++) {
          if(i === this.state.editIndex) {
            chg1.push(changedData1)
          } else {
            chg1.push(this.state.data1[i])
          }
        }
        this.setState({
          data1 : chg1
        })
      }
    } else {
      if(this.state.b7 !== "0" && this.state.b7 !== "1") {
        message.error("The Status has to be 0 or 1");
        this.setState({b7: '1'})
        flag = false
      } else if(this.state.b8 !== "0" && this.state.b8 !== "1" && this.state.b8 !== "2") {
        this.setState({b8: '1'})
        message.error("The role has to be 0, 1 or 2");
        flag = false
      }
      if(flag === true) {
        var changedData2 = [this.state.b1, this.state.b2, this.state.b3, this.state.b4, this.state.b5, this.state.b6, this.state.b7, this.state.b8, this.state.b9]
        changedData = changedData2
        var chg2 = []
        for(var j  = 0 ; j < this.state.data2.length ; j++) {
          if(j === this.state.editIndex) {
            chg2.push(changedData2)
          } else {
            chg2.push(this.state.data2[j])
          }
        }
        this.setState({
          data2 : chg2
        })
      }
    }

    if(flag === true) {
      this.setModalDefaultOpen(false)
      axios.post(server_url + `tenji-con/updateinfoUser`, {email: this.state.editEmail, type: this.state.dataType, changedData: changedData })
      .then(res => {
        if(res.data === true) {
          message.success("Success!")
        }
      })
    }
  }
  rowEditFunc(rowdata, rowmeta) {
    if(this.state.dataType === '0') {
      this.setState({
        editIndex: rowmeta['dataIndex'],
        editEmail : rowdata[6],
        t1: this.state.columns1[0], t2 : this.state.columns1[1], t3 : this.state.columns1[2], t4 : this.state.columns1[3], t5 : this.state.columns1[4], t6 : this.state.columns1[5], t7 : this.state.columns1[6], t8 : this.state.columns1[7], t9 : this.state.columns1[8], t10 : this.state.columns1[9], t11 : this.state.columns1[10],
        b1: rowdata[0], b2 : rowdata[1], b3 : rowdata[2], b4 : rowdata[3], b5 : rowdata[4], b6 : rowdata[5], b7 : rowdata[6], b8 : rowdata[7], b9 : rowdata[8], b10 : rowdata[9], b11 : rowdata[10]
      })
    } else {
      this.setState({
        editIndex: rowmeta['dataIndex'],
        editEmail : rowdata[4],
        t1: this.state.columns2[0], t2 : this.state.columns2[1], t3 : this.state.columns2[2], t4 : this.state.columns2[3], t5 : this.state.columns2[4], t6 : this.state.columns2[5], t7 : this.state.columns2[6], t8 : this.state.columns2[7], t9 : this.state.columns2[8],
        b1: rowdata[0], b2 : rowdata[1], b3 : rowdata[2], b4 : rowdata[3], b5 : rowdata[4], b6 : rowdata[5], b7 : rowdata[6], b8 : rowdata[7], b9 : rowdata[8]
      })
    }
    this.setModalDefaultOpen(true)
  }
  render() {
    return (
      <div>
        <div style={{ padding: '20px', textAlign: "right" }}>
          <Translator />
          <b>法人:</b>
          <Button variant="contained" color="primary" onClick={() => this.Company()} style={{ marginLeft: "10px" }}>
            <EmojiTransportationSharpIcon width="30" height="30" />
          </Button>
          <Button variant="contained" color="primary" onClick={() => this.Individual()} style={{ marginLeft: "10px" }}>
            <AccountCircleSharpIcon width="30" height="30" />
          </Button>
          <b>&nbsp; :個人</b>
          
          <Button variant="contained" color="primary" onClick={() => this.backward()} style={{ marginLeft: "10px" }}>
            <KeyboardBackspaceSharpIcon width="30" height="30" />
          </Button>

        </div>
        <React.Fragment>
          {(() => {
            if(this.state.dataType === '0') {
              return <MUIDataTable title={"法人"} data={this.state.data1} columns={this.state.columns1} options={this.state.options} />
            } else {
              return <MUIDataTable title={"個人"} data={this.state.data2} columns={this.state.columns2} options={this.state.options} />
            }
          })()}
        </React.Fragment>
        <Row>
          <Col md="4">
            <Modal
              isOpen={this.state.modalDefaultOpen}
              toggle={() => this.setModalDefaultOpen(false)}
            >
              <div className=" modal-header">
                <h6 className=" modal-title" id="modal-title-default">
                  Edit info
                </h6>
                <button
                  aria-label="Close"
                  className=" close"
                  onClick={() => this.setModalDefaultOpen(false)}
                  type="button"
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t1}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b1: e.target.value})}} value={this.state.b1} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t2}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b2: e.target.value})}} value={this.state.b2} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t3}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b3: e.target.value})}} value={this.state.b3} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t4}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b4: e.target.value})}} value={this.state.b4} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t5}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b5: e.target.value})}} value={this.state.b5} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t6}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b6: e.target.value})}} value={this.state.b6} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t7}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b7: e.target.value})}} value={this.state.b7} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t8}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b8: e.target.value})}} value={this.state.b8} />
                  </Col>
                </Row>
                <Row className="mb-10">
                  <Col className="textACM" xs={3}>{this.state.t9}</Col>
                  <Col>
                    <Input onChange={(e) => {this.setState({b9: e.target.value})}} value={this.state.b9} />
                  </Col>
                </Row>
                {(() => {
                  if(this.state.dataType === '0') {
                    return (
                      <>
                        <Row className="mb-10">
                          <Col className="textACM" xs={3}>{this.state.t10}</Col>
                          <Col>
                            <Input onChange={(e) => {this.setState({b10: e.target.value})}} value={this.state.b10} />
                          </Col>
                        </Row>
                        <Row className="mb-10">
                          <Col className="textACM" xs={3}>{this.state.t11}</Col>
                          <Col>
                            <Input onChange={(e) => {this.setState({b11: e.target.value})}} value={this.state.b11} />
                          </Col>
                        </Row>
                      </>
                    )
                  }
                })()}
              </div>
              <div className=" modal-footer">
                <Button color="primary" type="button"
                  onClick={() => this.saveChangedData()}
                >
                  Save changes
                </Button>
                <Button
                  className=" ml-auto"
                  color="link"
                  onClick={() => this.setModalDefaultOpen(false)}
                  type="button"
                >
                  Close
                </Button>
              </div>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BodyCellExample;