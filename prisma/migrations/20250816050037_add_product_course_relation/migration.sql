-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_Course_id_fkey" FOREIGN KEY ("Course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
