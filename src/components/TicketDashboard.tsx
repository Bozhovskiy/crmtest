"use client"
import * as React from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Filter, Plus, LogOut, Users, Briefcase} from 'lucide-react'
import {Input} from "@/components/ui/input"
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {fetchTickets, filterTicketsByLocation, Ticket} from "@/utils/fetchTickets"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {RangeSlider} from "@/components/ui/slider"
import {TicketModal} from './ticket-modal'

interface TicketDashboardProps {
    filter?: 'open' | 'in-progress' | 'closed'
}

export function TicketDashboard({filter}: TicketDashboardProps) {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedAction, setSelectedAction] = React.useState<string>('All');
    const [scoreRange, setScoreRange] = React.useState<[number, number]>([0, 10]);
    const [user, setUser] = React.useState<{ username: string, location: string } | null>(null);
    const router = useRouter()
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    React.useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
            router.push('/login')
            return
        }
        const userData = JSON.parse(userStr)
        setUser(userData)

        fetchTickets('output.csv')
            .then(data => {
                setTickets(filterTicketsByLocation(data, userData.location));
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tickets:", error);
                setLoading(false);
            });
    }, [router]);

    const filteredTickets = React.useMemo(() => {
        let filtered = tickets;
        if (selectedAction !== 'All') {
            filtered = filtered.filter(ticket => ticket.actions.includes(selectedAction));
        }
        filtered = filtered.filter(ticket =>
            ticket.score >= scoreRange[0] && ticket.score <= scoreRange[1]
        );
        if (filter) {
            filtered = filtered.filter(ticket => {
                if (filter === 'open') return ticket.score <= 3;
                if (filter === 'in-progress') return ticket.score > 3 && ticket.score <= 7;
                if (filter === 'closed') return ticket.score > 7;
                return true;
            });
        }
        return filtered;
    }, [tickets, filter, selectedAction, scoreRange]);

    const actions = React.useMemo(() => {
        const allActions = tickets.flatMap(ticket => ticket.actions);
        return ['All', ...new Set(allActions)];
    }, [tickets]);

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100" style={{width: '-webkit-fill-available'}}>
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 ml-16">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4"/>
                                New Ticket
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Search tickets..."
                                className="w-64"
                            />
                            <Button variant="default">Search</Button>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4"/>
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="p-4">
                        <div className="space-y-4">
                            <div className="text-sm font-medium">ADVANCED FILTERS</div>
                            <div className="flex space-x-2">
                                <Select value={selectedAction} onValueChange={setSelectedAction}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select action"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {actions.map((action) => (
                                            <SelectItem key={action} value={action}>
                                                {action}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-col w-[200px] space-y-4">
                                    <span className="text-sm">Score Range: {scoreRange[0]} - {scoreRange[1]}</span>
                                    <RangeSlider
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        value={scoreRange}
                                        onValueChange={(value: [number, number]) => setScoreRange(value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm">
                                    <Filter className="mr-2 h-4 w-4"/>
                                    Add filter
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Tickets Table */}
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox/>
                                    </TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Text</TableHead>
                                    <TableHead>Summary</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Actions</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket, key) => (
                                    <TableRow
                                        key={key}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleTicketClick(ticket)}
                                    >
                                        <TableCell>
                                            <Checkbox/>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/customer/${ticket.customer}`}>
                                                <div className="text-blue-600 hover:underline">
                                                    {ticket.customer}
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs truncate">{ticket.text1}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs truncate">{ticket.summary}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={ticket.score <= 3 ? "destructive" : ticket.score <= 7 ? "default" : "secondary"}>
                                                {ticket.score.toFixed(2)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{ticket.employee}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {ticket.actions.map((action, index) => (
                                                    <Badge key={index} variant="outline">{action}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{ticket.location}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
            <TicketModal
                ticket={selectedTicket}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

