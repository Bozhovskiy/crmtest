import Papa from 'papaparse';

export interface Ticket {
    customer: string;
    text1: string;
    summary: string;
    score: number;
    employee: string;
    actions: string[];
    location: string;
}

export async function fetchTickets(link:string): Promise<Ticket[]> {
    try {
        console.log(link)
        const response = await fetch(link); // Assuming you'll set up an API route to serve the CSV data
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response)
        const csvData = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const tickets: Ticket[] = results.data
                        .filter((row: any) => row.Customer && row.Score) // Ensure essential fields are present
                        .map((row: any) => ({
                            customer: row.Customer || '',
                            text1: row.Text || '',
                            text2: row.Text_2 || '', // Assuming the second 'Text' column is named 'Text_2' in the CSV
                            summary: row.Summary || '',
                            score: parseFloat(row.Score) || 0,
                            employee: row.Employee || '',
                            actions: row.Actions ? row.Actions.split(',').map((a: string) => a.trim()) : [],
                            location: row.Location || ''
                        }));
                    console.log(tickets)
                    resolve(tickets);
                },
                error: (error: any) => {
                    console.log(error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
        return [];
    }
}

export function filterTicketsByLocation(tickets: Ticket[], location: string): Ticket[] {
    return tickets.filter(ticket => ticket.location === location);
}

