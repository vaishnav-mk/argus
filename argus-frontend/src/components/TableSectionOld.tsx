import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import {
	CircleIcon,
	RefreshCwIcon,
	ListOrderedIcon,
	SearchIcon,
} from '@/components/icons/icons'
import { PaginationComponent } from '@/components/PaginationComponent'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getAllLogs } from '@/redux/slice/dataSlice'

const badgeVariant = (level) => {
	switch (level) {
		case 'info':
			return 'success'
		case 'warn':
			return 'warning'
		case 'error':
			return 'destructive'
		default:
			return 'neutral'
	}
}

const toJSON = (data) => JSON.stringify(data, null, 2)

const toCSV = (data) => {
	const headers = Object.keys(data[0]).join(',')
	const rows = data.map((row) => Object.values(row).join(','))
	return [headers, ...rows].join('\n')
}

const exportData = (data, format) => {
	const fileName = `logs-${new Date().toISOString()}`
	const dataStr = format === 'csv' ? toCSV(data) : toJSON(data)
	const dataUri = `data:text/${format};charset=utf-8,${dataStr}`

	const link = document.createElement('a')
	link.setAttribute('href', dataUri)
	link.setAttribute('download', `${fileName}.${format}`)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const sortData = (data, key, order = 'asc') => {
	return data.sort((a, b) => {
		if (a[key] < b[key]) {
			return order === 'asc' ? -1 : 1
		}
		if (a[key] > b[key]) {
			return order === 'asc' ? 1 : -1
		}
		return 0
	})
}

const SearchInput = ({ setSearch }) => (
	<div className="relative flex-1">
		<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search logs..."
			className="w-full rounded-md bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
			onChange={(e) => setSearch(e.target.value)}
		/>
	</div>
)

const ExportDropdown = ({ data }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="outline">Export</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuLabel>Export format</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={() => exportData(data, 'csv')}>
				CSV
			</DropdownMenuItem>
			<DropdownMenuItem onClick={() => exportData(data, 'json')}>
				JSON
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
)

const SortDropdown = ({ data, sortData, setSortData }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="outline" className="hidden sm:flex">
				<ListOrderedIcon className="h-4 w-4 mr-2" />
				Sort
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Sort by</DropdownMenuLabel>
			<DropdownMenuSeparator />
			{data?.length > 0 &&
				Object.keys(data?.at(0)).map((key) => (
					<DropdownMenuCheckboxItem
						checked={sortData.key === key}
						key={key}
						onClick={() => {
							const sortedData = sortData(
								data,
								key,
								sortData.direction
							)
							setSortData({
								key,
								direction:
									sortData.direction === 'asc' ? 'desc' : 'asc',
							})
							setData([...sortedData])
						}}
					>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</DropdownMenuCheckboxItem>
				))}
		</DropdownMenuContent>
	</DropdownMenu>
)

const LogTableRows = ({ loading, search, searchedData, data }) => {
	if (loading) {
		return Array.from({ length: 10 }).map((_, index) => (
			<TableRow key={index}>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="w-24 h-4" />
				</TableCell>
			</TableRow>
		))
	}

	const rowsToRender = search !== '' ? searchedData : data

	return rowsToRender.map((row) => (
		<TableRow key={row.timestamp}>
			<TableCell>{row.timestamp}</TableCell>
			<TableCell>{row.traceID}</TableCell>
			<TableCell>
				<Badge variant={badgeVariant(row.level)}>{row.level}</Badge>
			</TableCell>
			<TableCell>{row.message}</TableCell>
			<TableCell>{row.resourceID}</TableCell>
			<TableCell>{row.service}</TableCell>
			<TableCell>{row.spanID}</TableCell>
			<TableCell>{row.commit}</TableCell>
			<TableCell>{row.metadata.parentResourceId}</TableCell>
		</TableRow>
	))
}

export function TableSection() {
	const {
		isError,
		errorMessage: errors,
		logs: data,
		nextPageState: pageState,
		isLoading: loading,
	} = useSelector((state) => state.data)

	const dispatch = useDispatch()

	const [nextPageState, setNextPageState] = useState<string | null>(null)
	const [currentPageState, setCurrentPageState] = useState<string | null>(null)
	const [sortData, setSortData] = useState<any>({})
	const [search, setSearch] = useState<string>('')
	const [searchedData, setSearchedData] = useState<any[]>([])

	const searchData = data?.filter((row) =>
		Object.values(row).some((value) =>
			value.toString().toLowerCase().includes(search.toLowerCase())
		)
	)

	useEffect(() => {
		if (search !== '') {
			setSearchedData(searchData)
		}
	}, [search, searchData])

	return (
		<div className="w-full">
			<Card>
				<CardHeader>
					<div className="flex justify-between items-center gap-10">
						<div>
							<CardTitle>Log Search Results</CardTitle>
							<CardDescription>
								View the search results for your log data.
							</CardDescription>
						</div>
						<div className="flex gap-2">
							<SearchInput setSearch={setSearch} />
							<ExportDropdown data={data} />
							<SortDropdown
								data={data}
								sortData={sortData}
								setSortData={setSortData}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Timestamp</TableHead>
								<TableHead>Service</TableHead>
								<TableHead>Log Level</TableHead>
								<TableHead>Message</TableHead>
								<TableHead>Resource ID</TableHead>
								<TableHead>Trace ID</TableHead>
								<TableHead>Span ID</TableHead>
								<TableHead>Commit</TableHead>
								<TableHead>Metadata.parentResourceId</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<LogTableRows
								loading={loading}
								search={search}
								searchedData={searchedData}
								data={data}
							/>
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<PaginationComponent
						currentPageState={currentPageState}
						nextPageState={nextPageState}
						onPageChange={(pageState) => fetchData(pageState)}
					/>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1 text-muted-foreground">
							<CircleIcon className="h-3 w-3 text-green-500" />
							Connected
						</div>
						<Button
							variant="ghost"
							size="icon"
							// onClick={() => fetchData(currentPageState)}
						>
							<RefreshCwIcon
								className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
							/>
							<span className="sr-only">Refresh</span>
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
