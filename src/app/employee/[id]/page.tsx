import { EmployeeDetails } from '@/components/employee-details'

type paramsType = Promise<{ id: string }>;
export default async function Home({
                                       params,
                                   }: {
    params: paramsType;
}) {
    const {id} = await params
    console.log(id)
    return <EmployeeDetails customerId={id} />
}
