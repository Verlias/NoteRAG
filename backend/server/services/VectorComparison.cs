using System;
using MathNet.Numerics.LinearAlgebra;

namespace server.Services
{
    public class VectorComparison
    {
        public static double CosineSimiliarity(double[] A, double[] B)
        {
            Console.WriteLine("Cosine Similiarity");
            Console.WriteLine("-------");
            Console.WriteLine($"Vector A: {A}");
            Console.WriteLine($"Vector B: {B}");
            Console.WriteLine("-------");


            var v1 = Vector<double>.Build.DenseOfArray(A);
            var v2 = Vector<double>.Build.DenseOfArray(B);

            double v1_magnitude = v1.L2Norm();
            double v2_magnitude = v2.L2Norm();

            double numerator = v1.DotProduct(v2);
            double denominator = v1_magnitude * v2_magnitude;

            return numerator / denominator;
        }
    }
}