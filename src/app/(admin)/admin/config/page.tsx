import { getSystemConfig } from "@/lib/actions"
import { AdminConfigForm } from "@/components/admin/config-form"

export default async function AdminConfigPage() {
    const config = await getSystemConfig()

    return <AdminConfigForm initialConfig={config} />
}
