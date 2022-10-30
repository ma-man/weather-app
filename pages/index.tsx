import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import  Link from 'next/link'
import ChartStyles from '../styles/chart.module.css'
import UtilStyles from '../styles/Home.module.css'
import { fetchWeatherData } from '../lib/fetchData'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

export const Lineoptions: ChartOptions<'line'> = {
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Weather forecasts',
    },
  },
  scales: {
    x: {
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function(val, index) {
          // Hide every 6nd tick label
          return index % 6 === 0 && typeof val === 'number' ? this.getLabelForValue(val) : ''
        }
      },
    }
  }
}

export const Doughnutoptions = {
  responsive: false,
  maintainAspectRatio: false,
  legend: {
    position: 'top' as const,
  },
  plugins: {

  },
}

interface Props {
  temData : number[]
  humidityData : number[]
  rainData: number[]
  dataTime : string[]
}

const Home: NextPage<Props> = ({ temData, humidityData, rainData, dataTime }) => {


  const [drawReady, setdrawReady] = useState<boolean>(false)

  class drawLine {
    isDrawdata: ChartData<'line'> = {
      labels: [],
      datasets: [
        {
        label: 'Temperature',
        data: [],
        borderWidth: 2,
        fill: false,
        borderColor: "#742774"
      },
      {
        label: 'Rainfall',
        data: [],
        borderWidth: 2,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }]
    }

    setDrawdata() {
      this.isDrawdata.labels = dataTime
      this.isDrawdata.datasets[0].data = temData
      this.isDrawdata.datasets[1].data = rainData
    }
  }

  class drawDoughnut {
    isDrawMaxdata: ChartData<'doughnut'> = {
      labels: undefined,
      datasets: [
        {
          label: '',
          data: [1],
          backgroundColor: [
            '#efefef',
          ],
          borderWidth: 0,
        },
        {
          label: 'maxhumidity',
          data: [],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            '#fff',
          ],
          borderWidth: 1,
        },
        
      ],
    }

    isDrawMindata: ChartData<'doughnut'> = {
      labels: undefined,
      datasets: [
        {
          label: '',
          data: [1],
          backgroundColor: [
            '#efefef',
          ],
          borderWidth: 0,
        },
        {
          label: 'maxhumidity',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            '#fff',
          ],
          borderWidth: 1,
        },
        
      ],
    }

    setDrawDoughnut() {
      const maxHumiSuplus = (100 - humidityData[0])
      const minHumiSuplus = (100 - humidityData[1])

      this.isDrawMaxdata.datasets[1].data = [humidityData[0], maxHumiSuplus]
      this.isDrawMindata.datasets[1].data = [humidityData[1], minHumiSuplus]
    }
  }

  const drawli = new drawLine
  const drawDo = new drawDoughnut
  Promise.all([
    drawli.setDrawdata(),
    drawDo.setDrawDoughnut()
  ])
  .then(() => {
    setdrawReady((prevState) => !prevState)
  }).then(() => {
    // console.log(drawDo.isDrawdata.datasets[0].data)
  })
  
  return (
    <div className={UtilStyles.body}>
        <header className={UtilStyles.header}>
          <h1 className={UtilStyles.h1}>Weather Forecasts</h1>
          <nav className={UtilStyles.nav}>
            <ul className={UtilStyles.ul}>
              <li className={UtilStyles.li}>Home</li>
              <li className={UtilStyles.li}>Blog</li>
              <li className={UtilStyles.li}></li>
              <li className={UtilStyles.li}></li>
            </ul>
          </nav>
        </header>
      {drawReady ? (
          <div className={UtilStyles.container}>
            <div className={ChartStyles.divChart}>
              <div className={ChartStyles.itemLine}>
                <Line height={500} width={800} options={Lineoptions} data={drawli.isDrawdata} />
              </div>
              <div className={ChartStyles.itemDoMax}>
                <Doughnut height={200} width={200} options={Doughnutoptions} data={drawDo.isDrawMaxdata} />
              </div>
              <div className={ChartStyles.itemDoMin}>
                <Doughnut height={200} width={200} options={Doughnutoptions} data={drawDo.isDrawMindata} />
              </div>
            </div>
          </div>
        ) : (
          <h2 className={UtilStyles.h2}>Now Loading</h2>
        )}
        <div className={UtilStyles.footer}>
              <Link href={'/posts/meteo'}>
                <a className={UtilStyles.a}>Go to the API ducument</a>
              </Link>
        </div>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {

  const { temData, humidityData, rainData, dataTime} = await fetchWeatherData()

  return {
    props: {
      temData,
      humidityData,
      rainData,
      dataTime
    }
  }
}

