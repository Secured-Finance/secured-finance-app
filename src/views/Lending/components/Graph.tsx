import React, { useState, Component, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { chartOptions } from './variables';
import { RootState } from "../../../store/types";
import { connect } from "react-redux";
import { LendingStore } from "../../../store/lending/types";
import CurrencyContainer from "../../../components/CurrencyContainer";

const labels = ["0", "3m", "6m", "1y", "2y", "3y", "5y"]

interface YieldGraphProps {
	borrowRates: any[]
	lendingRates: any[]
	midRate: any[]
}

type CombinedProps = YieldGraphProps & LendingStore;

const YieldGraph: React.FC<CombinedProps> = ({ borrowRates, lendingRates, midRate, selectedCcy, currencyIndex}) => {
  	const [lineData, setLineData] = useState({});

	let canvas: HTMLCanvasElement = document.createElement("canvas");
	let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
	var blueGradient = ctx.createLinearGradient(0, 0, 0, 290);
	blueGradient.addColorStop(0, "rgba(0, 122, 255, 0.5)");
	blueGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");
	
	var yellowGradient = ctx.createLinearGradient(0, 0, 0, 290);
	yellowGradient.addColorStop(0, "rgba(242, 109, 79, 1)");
	yellowGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");

	var purpleGradient = ctx.createLinearGradient(0, 0, 0, 290);
	purpleGradient.addColorStop(0, "rgba(145, 59, 175, 1)");
	purpleGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");

	const convertArray = (array: Array<any>) => {
		if (array.length > 0) {
			const newArray = array.slice()
			newArray.unshift(0)
			return newArray.map((r:any) => r/100)
		}
	}

	useEffect(() => {
		async function updateGraph() {
			let graphData = await {
				labels: labels,
				datasets: [
				{
					label: "Borrow yield",
					fill: true,
					lineTension: 0.4,
					backgroundColor: blueGradient,
					borderColor: "rgba(0, 122, 255, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
					data: borrowRates.length ? convertArray(borrowRates) : [],
					borderWidth: 2,
					opacity: 1,
					hidden: false,
				},
				{
					label: "Lend yield",
					fill: true,
					lineTension: 0.4,
					backgroundColor: purpleGradient,
					borderColor: "rgba(145, 59, 175, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
					data: lendingRates.length ? convertArray(lendingRates) : [],
					borderWidth: 2,
					opacity: 0.1,
					hidden: false,
				},
				{
					label: "Mid Rate",
					fill: false,
					lineTension: 0.4,
					backgroundColor: yellowGradient,
					borderColor: "rgba(242, 109, 79, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
					data: midRate.length ? convertArray(midRate) : [],
					borderWidth: 2,
					opacity: 1,
					hidden: false,
				},
				],
			}		
			setLineData(graphData);
		}
		updateGraph();
	 }, [borrowRates, lendingRates, midRate, currencyIndex])	
    		
  return (
	<StyledYieldCurveContainer>
		<StyledYieldCurveInfo>
			<StyledCurrencyContainer>
				<CurrencyContainer 
					index={currencyIndex} 
					size={"xl"} 
					short={false} 
					style={{fontWeight: 400}}
				/>
				<StyledCurrencyText>({selectedCcy}) yield curve</StyledCurrencyText>
			</StyledCurrencyContainer>
		</StyledYieldCurveInfo>
		<Line data={lineData} options={chartOptions}/>
	</StyledYieldCurveContainer>
  );
}

const StyledYieldCurveContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	min-width: 700px;
`

const StyledYieldCurveInfo = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: ${(props) => props.theme.spacing[0]}px;
	padding-bottom: ${(props) => props.theme.spacing[4]}px;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
`

const StyledCurrencyContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-weight: 400;
	font-size: 20px;
	color: ${(props) => props.theme.colors.white};
`

const StyledCurrencyText = styled.p`
	margin: 0;
	margin-left: 5px;
`

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(YieldGraph);
