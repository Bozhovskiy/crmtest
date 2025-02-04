import { CustomerDetails } from '@/components/customer-details'
type paramsType = Promise<{ id: string }>;
export default async function Home({
                                       params,
                                   }: {
    params: paramsType;
}) {
    const {id} = await params
    console.log(id)

    return <CustomerDetails customerId={id} />
}
