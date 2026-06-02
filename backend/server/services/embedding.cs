using System;
using System.Net.Mime;
using Google.GenAI;
using Google.GenAI.Types;

namespace server.Services
{
    public class Embeddings
    {

        public async Task Embedding()
        {
           var client = new Client();

           var response = await client.Models.EmbedContentAsync(
            model: "gemini-embedding-2",
            contents: "What is the capital of USA"
           );

           if (response.Embeddings != null)
            {
                Console.WriteLine(response.Embeddings[0].Values);
            }

        }
    }
}
