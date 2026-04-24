'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Usamos la de servicio para saltarnos RLS si fuera necesario

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function submitLead(formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
}) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: `[${formData.subject}] ${formData.message}`,
          status: 'new'
        }
      ])
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error submitting lead:', error.message)
    return { success: false, error: error.message }
  }
}
