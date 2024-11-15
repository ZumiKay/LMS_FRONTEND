import { BookType } from "../types/book.type";
import { upload } from "@vercel/blob/client";
import { ROLE } from "../types/user.type";

export function formatDateToMMDDYYYYHHMMSS(date: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : n); // Padding single digits with leading zero

  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

export const ApiRequest = async ({
  url,
  method,
  data,
  cookies,
  refreshToken = true,
  blob,
}: {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  data?: unknown;
  cookies?: boolean;
  refreshToken?: boolean;
  blob?: boolean;
}): Promise<{
  success: boolean;
  data?: unknown;
  totalpage?: number;
  error?: unknown;
  message?: string;
  schooldata?: unknown;
  totalcount?: number;
}> => {
  try {
    // Setup headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Configure request options
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(method !== "GET" && { body: JSON.stringify(data) }),
      ...(cookies && { credentials: "include" }),
    };

    // Make the request
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${url}`,
      fetchOptions
    );

    // Parse the response JSON
    const result = blob ? await response.blob() : await response.json();

    // Check for response success
    if (!response.ok) {
      if (response.status === 401 && refreshToken) {
        //refresh Token
        const refreshtoken = await fetch(
          `${import.meta.env.VITE_API_URL}/user/refreshtoken`,
          { method: "GET", credentials: "include", headers }
        );
        if (!refreshtoken.ok) {
          return { success: false };
        }
      }

      return {
        success: false,
        message: result?.message || "An error occurred",
        error: result,
      };
    }

    // Return successful response
    return {
      success: true,
      ...(blob ? { data: result } : { ...result }),
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error };
  }
};

export function filterPopularBooks(books: Array<BookType>, limit: number) {
  const sortedBooks = books?.sort((a, b) => b.borrow_count - a.borrow_count);

  const popularBooks = sortedBooks?.slice(0, limit);

  return popularBooks;
}

export function convertToPascalCase(input: string): string {
  return input.replace(/(^\w|[-_ ]\w)/g, (match) =>
    match.replace(/[-_ ]/, "").toUpperCase()
  );
}

interface GetStudentFromParagonApiType {
  id_number: string;
  profile_url: string;
  name: string;
  department: string;
  faculty: string;
}

export async function GetStudentFromParagonApi(id: string) {
  const response = await fetch(
    ` https://my.paragoniu.edu.kh/api/anonymous/students/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res = await response.json();
  if (response.ok && res.data) {
    const data = res.data as GetStudentFromParagonApiType;
    return data;
  }
  return null;
}

export function generateSemesterArray() {
  const currentYear = new Date().getFullYear();
  const startYear = 2019;
  const semestersPerYear = 3;
  const semesterFilters = [
    { startMonth: 10, endMonth: 2 },
    { startMonth: 2, endMonth: 7 },
    { startMonth: 7, endMonth: 9 },
  ];
  const semesters = [];
  for (let year = startYear; year <= currentYear; year++) {
    for (let semester = 0; semester < semestersPerYear; semester++) {
      const semesterCode = `${year}-${year + 1}/${semester + 1}`;
      const filter = semesterFilters[semester];
      const startYearOffset = semester === 0 ? 0 : 1;
      const filterValue = {
        start: new Date(year + startYearOffset, filter.startMonth),
        end: new Date(year + 1, filter.endMonth),
      };
      semesters.push({ name: semesterCode, filter: filterValue });
    }
  }

  return semesters;
}

export const sessionLoader = async () => {
  const response = await ApiRequest({
    url: "/checksession",
    method: "GET",
    cookies: true,
  });

  if (!response.success) {
    return null;
  }

  const result: { cart: number; data?: { role: ROLE } } = { cart: 0 };

  result.data = response.data as { role: ROLE };
  if (result.data && result.data.role !== ROLE.LIBRARIAN) {
    const checkcart = await ApiRequest({
      url: "/user/checkcart",
      method: "GET",
      cookies: true,
    });

    if (checkcart.success) {
      result.cart = checkcart.data as never;
    }
  }

  return { ...result.data, cart: result.cart };
};

export function normalizeString(input: string): string {
  return input.replace(/\s+/g, "").toLowerCase();
}

export async function UploadImage(file: File) {
  try {
    const updatereq = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: `${import.meta.env.VITE_API_URL}/uploadimg`,
    });

    return updatereq;
  } catch (error) {
    console.log(error);
    return null;
  }
}