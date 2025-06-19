from llm_helper import llm
from few_shots import Few_Shots
def get_length_str(length):
    if length=="Short":
        return "1 to 5 lines"
    elif length=="Medium":
        return "6 to 10 lines"
    else:
        return "11 to 15 lines"

def get_prompt(length,language,topic):
    length_str=get_length_str(length)
    fs=Few_Shots()
    prompt=f'''
    Generate a LinkedIn post using the below information with preamble
    
    1) Topic:{topic}
    2) Length:{length_str}
    3) Language:{language}
    4) include hashtags in the end
    5) include appropriate emojis if asked'''

    examples=fs.get_filtered_posts(length,language,topic)

    if len(examples)>0:
        prompt+="\n5) Use the writing style as per the following examples."
        for i,post in enumerate(examples):# we get index of post and post itself when we use enumerate
            post_text=post['text']
            prompt+=f"\n\n Example {i+1}: \n\n {post_text}"

            if i==1:
                break
    return prompt

def generate_post(length,language,topic):
    prompt=get_prompt(length,language,topic)
    print(prompt)
    response=llm.invoke(prompt)
    return response.content

if __name__=="__main__":
    post=generate_post("Long","English","Mental Health")
    print(post)