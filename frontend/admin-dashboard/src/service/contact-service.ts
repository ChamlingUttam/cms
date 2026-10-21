import { apiClient } from '@/api/client';
import { contactEndpoints } from '@/api-endpoints/contact';
import type { ApiResponse } from '@/types/auth';
import type { ContactInfo, ContactInput } from '@/types/content';

export async function getContactInfo(): Promise<ContactInfo> {
  const { data } = await apiClient.get<ApiResponse<{ contact: ContactInfo }>>(
    contactEndpoints.item,
  );
  return data.data.contact;
}

export async function createContactInfo(
  input: ContactInput,
): Promise<ContactInfo> {
  const { data } = await apiClient.post<ApiResponse<{ contact: ContactInfo }>>(
    contactEndpoints.item,
    input,
  );
  return data.data.contact;
}

export async function updateContactInfo(
  input: ContactInput,
): Promise<ContactInfo> {
  const { data } = await apiClient.patch<ApiResponse<{ contact: ContactInfo }>>(
    contactEndpoints.item,
    input,
  );
  return data.data.contact;
}

export async function deleteContactInfo(): Promise<void> {
  await apiClient.delete(contactEndpoints.item);
}
