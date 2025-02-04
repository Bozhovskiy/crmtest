import { EmployeeDetails } from '@/components/employee-details'

export default function CustomerPage({ params }: { params: { id: string } }) {
    return <EmployeeDetails customerId={params.id} />
}
