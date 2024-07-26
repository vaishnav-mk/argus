import { NextResponse } from 'next/server';

function cleanRequestData(reqData) {
	const cleanedData = {};

	if (reqData.text) cleanedData.text = reqData.text;
	if (reqData.regex) cleanedData.regex = reqData.regex;

	cleanedData.filters = reqData.filters.filter(
		(filter) => filter.filterValues.length > 0
	);

	if (reqData.timespan.startTime || reqData.timespan.endTime) {
		cleanedData.timespan = {};
		if (reqData.timespan.startTime)
			cleanedData.timespan.startTime = reqData.timespan.startTime;
		if (reqData.timespan.endTime)
			cleanedData.timespan.endTime = reqData.timespan.endTime;
	}

	return cleanedData;
}

export async function POST(request) {
	const params = request.nextUrl.searchParams;
	const limit = params.get('limit') || 25;
	const reqData = await request.json();
	const cleanedData = cleanRequestData(reqData);

	const response = await fetch(
		`http://localhost:5000/logs/search?limit=${limit}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(cleanedData),
		}
	);

	const data = await response.json();

	return NextResponse.json(data);
}
