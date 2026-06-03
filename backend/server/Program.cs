using System;
using System.IO.Pipelines;
using System.Numerics;
using Google.GenAI;
using Google.GenAI.Types;
using server.Services;


namespace myApplication
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Embeddings service = new Embeddings();
            // await service.Embedding();
            double[] Vector1 = [0.12, -0.45, 0.88, 0.31, -0.09, 0.56, -0.72, 0.24];
            double[] Vector2 = [0.15, -0.41, 0.83, 0.29, -0.11, 0.61, -0.69, 0.20];

            double cosine_similiarity_vector = VectorComparison.CosineSimiliarity(Vector1, Vector2);
            Console.WriteLine($"Cosine Similiarity Vector: {cosine_similiarity_vector}");
        }
    }
}