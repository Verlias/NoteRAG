from transformers import AutoProcessor, Llama4ForConditionalGeneration, AutoTokenizer
import torch

'''
Runs Models Locally on your own Machine
'''


if __name__ == "__main__":
    user_input = input("Enter your prompt: ") 
    print(f"Prompt: {user_input}")

    model_id = "meta-llama/llama-4-Maverick-17B-128E-Instruct-FP8"
    #Handles the preprocessing of inputs before they got into the model

    processor = AutoProcessor.from_pretrained("meta-llama/llama-4-Maverick-17B-128E-Instruct-FP8")

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": {user_input}}
            ]
        },
    ]
    
    #Neural Network that Performs the inference
    model = Llama4ForConditionalGeneration.from_pretrained(
        model_id,
        torch_dtype="auto",
    )

    inputs = processor.apply_chat_template(
        messages,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
        add_generation_prompt=True
    )

    outputs = model.generate(**inputs.to(model.device), max_new_tokens=100)
    outputs = processor.batch_decode(outputs[:, inputs["input_ids"].shape[-1]:])
    print(outputs[0])