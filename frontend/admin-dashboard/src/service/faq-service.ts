import { apiClient } from '@/api/client';
import { faqEndpoints } from '@/api-endpoints/faq';
import type { ApiResponse } from '@/types/auth';
import type { Faq, FaqInput } from '@/types/content';

export async function getFaqs(): Promise<Faq[]> {
  const { data } = await apiClient.get<ApiResponse<{ faqs: Faq[] }>>(
    faqEndpoints.list,
  );
  return data.data.faqs;
}

export async function createFaq(input: FaqInput): Promise<Faq> {
  const { data } = await apiClient.post<ApiResponse<{ faq: Faq }>>(
    faqEndpoints.list,
    input,
  );
  return data.data.faq;
}

export async function updateFaq(
  id: string,
  input: FaqInput,
): Promise<Faq> {
  const { data } = await apiClient.patch<ApiResponse<{ faq: Faq }>>(
    faqEndpoints.byId(id),
    input,
  );
  return data.data.faq;
}

export async function deleteFaq(id: string): Promise<void> {
  await apiClient.delete(faqEndpoints.byId(id));
}
