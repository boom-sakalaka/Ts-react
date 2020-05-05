import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, message } from "antd";
import ReactEcharts from "echarts-for-react";
import moment from "moment";
import "./style.css";
import axios from "axios";

interface CourseItem {
  title: string;
  count: number;
}

interface State {
  isLogin: boolean;
  data: {
    [key: string]: CourseItem[];
  };
}

class Home extends Component {
  state: State = {
    isLogin: true,
    data: {},
  };

  componentDidMount() {
    axios.get("/api/isLogin").then((res) => {
      if (!res.data?.data) {
        this.setState({ isLogin: false });
      }
    });
    axios.get("/api/showData").then((res) => {
      if (res.data?.data) {
        this.setState({
          data: res.data.data,
        });
      }
    });
  }
  handleLogoutClick = () => {
    axios.get("/api/logout").then((res) => {
      if (res.data?.data) {
        this.setState({
          isLogin: false,
        });
      } else {
        message.error("退出失败!");
      }
    });
  };
  hendleCrowllerClick = () => {
    axios.get("/api/getData").then((res) => {
      if (res.data?.data) {
        message.success("爬取成功!");
      } else {
        message.error("爬取失败!");
      }
    });
  };
  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format("MM-DD HH:mm"));
      item.forEach((innerItem) => {
        const { title, count } = innerItem;

        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title]
          ? tempData[title].push(count)
          : (tempData[title] = [count]);
      });
    }
    const result: echarts.EChartOption.Series[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: "line",
        data: tempData[i],
      });
    }
    return {
      title: {
        text: "课程在线学习人数",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: courseNames,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: "value",
      },
      series: result,
    };
  };
  render() {
    const { isLogin } = this.state;
    if (isLogin) {
      return (
        <div className="home-page">
          <div className="buttons">
            <Button
              type="primary"
              onClick={this.hendleCrowllerClick}
              style={{ marginLeft: 15 }}
            >
              爬取
            </Button>
            <Button
              type="primary"
              onClick={this.handleLogoutClick}
              style={{ marginLeft: 15 }}
            >
              退出
            </Button>
          </div>

          <ReactEcharts option={this.getOption()} />
        </div>
      );
    }

    return <Redirect to="/login" />;
  }
}

export default Home;
