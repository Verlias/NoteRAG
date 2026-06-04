using System;
using UglyToad.PdfPig;

namespace server.Services
{
    public class PdfTextExtractor
    {
        public static void Extract()
        {
            string? filepath = Environment.GetEnvironmentVariable("FILE_PATH");

            if (filepath == null) {
                throw new Exception("FILE_PATH Environment Variable is missing");
            }

            using var document = PdfDocument.Open(filepath);

            Console.WriteLine("Extracting the world");

            foreach (var page in document.GetPages())
            {
                Console.WriteLine(page.Text);
            }
        }
    }
}
