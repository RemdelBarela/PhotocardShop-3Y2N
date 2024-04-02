import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import Error from "../../../Shared/Error";

const OrderChart = () => {
  const [photoChartData, setPhotoChartData] = useState([]);
  const [materialChartData, setMaterialChartData] = useState([]);
  const [totalSalesPerDay, setTotalSalesPerDay] = useState([]);
  const [error, setError] = useState(null);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: 'Arial',
      textAlign: 'center' 
    },
    decimalPlaces: 0,
    pieRadius: 50,
    pieColors: [
      "#262626 ", 
      "#CCCCCC", 
      "#A6A6A6", 
      "#808080", 
      "#595959", 
      "#262626",
      "#000000",
      "#6C7B8B", 
      "#B0C4DE", 
      "#778899", 
      "#D3D3D3" 
    ]
  };
  
  useEffect(() => {
    fetchOrderChartData();
    fetchTotalSalesPerDay();
  }, []);

  const lineChartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "3",
      stroke: "#B0C4DE"
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: 'Arial',
      textAlign: 'center',
      rotateLabels: 45 // Rotate the labels by 45 degrees for better readability
    },
    decimalPlaces: 0,
  };

  // const fetchOrderChartData = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}orders/get/photoMaterialOrders`);
  //     console.log("Response data:", response.data); // Log the response data
  //     if (response.data && typeof response.data === 'object') {
  //       const photoData = response.data.photoOrders || [];
  //       const materialData = response.data.materialOrders || [];
  //       setPhotoChartData(photoData.filter(item => item.photoName));
  //       setMaterialChartData(materialData.filter(item => item.materialName !== null));
  //     } else {
  //       console.error("Invalid response data format:", response.data);
  //       setError("Invalid response data format. Please try again later.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching order chart data:", error);
  //     setError("Failed to fetch order chart data. Please try again later.");
  //   }
  // };

  const fetchOrderChartData = async () => {
    try {
      const response = await axios.get(`${baseURL}orders/get/photoMaterialOrders`);
      setPhotoChartData(response.data.filter(item => item.photoName));
      setMaterialChartData(response.data.filter(item => item.materialName));
    } catch (error) {
      console.error("Error fetching order chart data:", error);
      setError("Failed to fetch order chart data. Please try again later.");
    }
  };

  const fetchTotalSalesPerDay = async () => {
    try {
      const response = await axios.get(`${baseURL}orders/get/totalsales`);
      console.log("Total sales per day response:", response.data);
      setTotalSalesPerDay(response.data);
    } catch (error) {
      console.error("Error fetching total sales per day:", error);
      setError("Failed to fetch total sales per day. Please try again later.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {error && <Error message={error} />}
        {!error && (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.header}>TOTAL PHOTO ORDERS</Text>
              <PieChart
                data={photoChartData.map((item, index) => ({
                  name: item.photoName,
                  population: item.totalOrders,
                  color: chartConfig.pieColors[index % chartConfig.pieColors.length]
                }))}
                width={400}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
                absolute
              />
            </View>
            {/* <View style={styles.chartContainer}>
              <Text style={styles.header}>TOTAL MATERIAL ORDERS</Text>
              <LineChart
                data={{
                  labels: materialChartData.map(item => item.materialName),
                  datasets: [
                    {
                      data: materialChartData.map(item => item.totalOrders),
                    },
                  ],
                }}
                width={400}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View> */}
            <View style={styles.chartContainer}>
              <Text style={styles.header}>TOTAL MATERIAL ORDERS</Text>
              {materialChartData.length > 0 && ( // Check if materialChartData is not empty
                <LineChart
                  data={{
                    labels: materialChartData.map(item => item.materialName),
                    datasets: [
                      {
                        data: materialChartData.map(item => item.totalOrders),
                      },
                    ],
                  }}
                  width={400}
                  height={250}
                  chartConfig={{
                    ...lineChartConfig ,
                    propsForLabels: {
                      ...lineChartConfig .propsForLabels,
                      rotation: 45, // Rotate the labels by 45 degrees
                    },
                  }}
                  style={styles.chart}
                />
              )}
              {materialChartData.length === 0 && ( // Render a message if materialChartData is empty
                <Text>NO DATA AVAILABLE FOR MATERIAL ORDERS</Text>
              )}
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.header}>TOTAL DAILY SALES</Text>
              <BarChart
                data={{
                  labels: totalSalesPerDay.map((salesData) => salesData._id),
                  datasets: [
                    {
                      data: totalSalesPerDay.map((salesData) => salesData.totalSales),
                    },
                  ],
                }}
                width={400}
                height={250}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "100",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30",
  },
  chartContainer: {
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    padding: 5,
    borderRadius: 8 
  }
});

export default OrderChart;
