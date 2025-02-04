import { CustomerDetails } from '@/components/customer-details'

export default function CustomerPage({ params }: { params: { id: string } }) {
    return <CustomerDetails customerId={params.id} />
}
