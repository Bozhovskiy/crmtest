"use client"

import { useEffect, useState } from 'react'
import { fetchTickets, Ticket } from "@/utils/fetchTickets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TicketModal } from './ticket-modal'

interface CustomerDetailsProps {
    customerId: string
}

export function EmployeeDetails({ customerId }: CustomerDetailsProps) {
    const [customerTickets, setCustomerTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const getTickets = async () => {
            const tickets = await fetchTickets('../../output.csv')
            console.log(customerId)
            console.log(tickets)
            const filteredTickets = tickets.filter(ticket => ticket.employee === customerId)
            setCustomerTickets(filteredTickets)
            setLoading(false)
        }
        getTickets().then()
    }, [customerId])

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setIsModalOpen(true)
    }

    if (loading) {
        return <div>Loading...</div>
    }

    const employee = customerTickets[0]?.employee || 'Unknown Employee'

    return (
        <div className="container mx-auto p-4 h-full">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{employee}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Text</TableHead>
                                <TableHead>Summary</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerTickets.map((ticket, index) => (
                                <TableRow
                                    key={index}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <TableCell>
                                        <div className="max-w-xs truncate">{ticket.customer}</div>
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
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {ticket.actions.map((action, index) => (
                                                <Badge key={index} variant="outline">{action}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TicketModal
                ticket={selectedTicket}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}