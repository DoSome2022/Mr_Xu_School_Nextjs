"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface School {
  id: string;
  school_name: string;
}

const SchoolListsbysupadmin = () => {
  const params = useParams();
  const supadminid = params?.supadminid as string;
  const [schoolsData, setSchoolsData] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [searchField, setSearchField] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolsData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/School_Lists");
        if (!res.ok) {
          throw new Error("無法獲取學校列表數據");
        }
        const result: School[] = await res.json();
        setSchoolsData(result);
      } catch (error: any) {
        console.error("獲取學校數據失敗:", error);
        setError("無法載入學校列表");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolsData();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/SchoolLists_search?query=${encodeURIComponent(
          searchQuery
        )}&field=${searchField}`
      );
      if (!response.ok) {
        throw new Error("搜尋失敗");
      }
      const data: School[] = await response.json();
      setSearchResults(data);
    } catch (error: any) {
      console.error("搜尋失敗:", error);
      setError("搜尋學校失敗");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-medium">正在載入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">學校列表</h1>
          <Link
            href={`/supadmin/${supadminid}/schoolLists/createschool`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200 text-sm font-medium"
          >
            建立學校
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Input
              type="text"
              placeholder="輸入搜尋內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200"
            />
            <Select
              value={searchField}
              onValueChange={setSearchField}
            >
              <SelectTrigger className="w-40 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors duration-200">
                <SelectValue placeholder="選擇欄位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有欄位</SelectItem>
                <SelectItem value="school_name">學校名稱</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
            >
              搜尋
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">搜尋結果</h2>
              <div className="space-y-4">
                {searchResults.map((school) => (
                  <div
                    key={school.id}
                    className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Link
                      href={`/supadmin/${supadminid}/schoolLists/${school.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      學校: {school.school_name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">所有學校</h2>
          {schoolsData.length > 0 ? (
            <div className="space-y-4">
              {schoolsData.map((school) => (
                <div
                  key={school.id}
                  className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Link
                    href={`/supadmin/${supadminid}/schoolLists/${school.id}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    學校: {school.school_name}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">無學校數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolListsbysupadmin;