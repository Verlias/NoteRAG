using System;
using Google.GenAI;
using Google.GenAI.Types;
using server.Services;


namespace myApplication
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Embeddings service = new Embeddings();
            await service.Embedding();
            Console.WriteLine("Hello World");
        }
    }
}