import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Ticket } from "@/utils/fetchTickets"
import Link from "next/link";

interface TicketModalProps {
    ticket: Ticket | null
    isOpen: boolean
    onClose: () => void
}

export function TicketModal({ ticket, isOpen, onClose }: TicketModalProps) {
    if (!ticket) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about the selected ticket.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <h3 className="font-medium">Customer</h3>
                        <Link href={`/customer/${ticket.customer}`}>
                            <p>{ticket.customer}</p>
                        </Link>
                    </div>
                    <div>
                        <h3 className="font-medium">Text</h3>
                        <p>{ticket.text1}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Summary</h3>
                        <p>{ticket.summary}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Score</h3>
                        <Badge variant={ticket.score <= 3 ? "destructive" : ticket.score <= 7 ? "default" : "secondary"}>
                            {ticket.score.toFixed(2)}
                        </Badge>
                    </div>
                    <div>
                        <h3 className="font-medium">Employee</h3>
                        <Link href={`/employee/${ticket.employee}`}>
                            <p>{ticket.employee}</p>
                        </Link>
                    </div>
                    <div>
                        <h3 className="font-medium">Actions</h3>
                        <div className="flex flex-wrap gap-1">
                            {ticket.actions.map((action, index) => (
                                <Badge key={index} variant="outline">{action}</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium">Location</h3>
                        <p>{ticket.location}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
