const MyclassDetail = () => {

    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">
            <div className="col-span-1">
              <div className="flex justify-between">
                <p className="text-gray-500">李同學</p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded">返回</button>
              </div>
            </div>
            <div className="col-span-1 mt-8">
              <table className="table-auto w-full border-collapse">
                <tbody>
                  <tr>
                    <th className="border p-2">日期</th>
                    <td className="border p-2">2（二）</td>
                  </tr>
                  <tr>
                    <th className="border p-2">科目</th>
                    <td className="border p-2">數學</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課堂ID</th>
                    <td className="border p-2">2024020801</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課堂時間</th>
                    <td className="border p-2">10:00-11:00</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課堂月份</th>
                    <td className="border p-2">April</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課堂年級</th>
                    <td className="border p-2">小三</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課室</th>
                    <td className="border p-2">1號</td>
                  </tr>
                  <tr>
                    <th className="border p-2">分校</th>
                    <td className="border p-2">麗晶</td>
                  </tr>
                  <tr>
                    <th className="border p-2">課堂節數</th>
                    <td className="border p-2">L1</td>
                  </tr>
                  <tr>
                    <th className="border p-2">老師</th>
                    <td className="border p-2">Miss Lo</td>
                  </tr>
                </tbody>
              </table>
              <button className="bg-blue-400 text-white px-4 py-2 rounded mt-4">申請請假</button>
            </div>
            <div className="col-span-1 flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-4">
              <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
              <p>Whatsapp: 59190844</p>
              <p>info@target.edu.hk</p>
            </div>
          </div>
        </div>
      );

}

export default MyclassDetail