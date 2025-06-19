import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from llm_helper import llm


def process_posts(raw_file_path,processed_file_path=None):
    enriched_posts=[]
    with open(raw_file_path,encoding='utf-8') as file:
        posts=json.load(file)
        for post in posts:
            meta_data=extract_metadata(post['text'])
            post_with_metadata=post | meta_data
            enriched_posts.append(post_with_metadata)
        
        #for epost in enriched_posts:
            #print(epost)
        
        unified_tags=get_unified_tags(enriched_posts)

        for post in enriched_posts:
            current_tags=post['tags']
            new_tags={unified_tags[tag] for tag in current_tags}
            post['tags']=list(new_tags)

        with open(processed_file_path,encoding='utf-8',mode='w') as outfile:
            json.dump(enriched_posts,outfile,indent=4)

def get_unified_tags(post_with_meta_data):
    unique_tags=set()
    for post in post_with_meta_data:
        unique_tags.update(post['tags'])
    unique_tags_list=','.join(unique_tags)

    template='''I will give you a list of tags. You need to unify tags with the following requiremnets.
    1. Tags are unified and merged to create a shorter list.
       Example 1: "Career Growth","Career Development" can all be merged into a simple tag "Career Development."
       Example 2: "Lead without control","Lift your team" can be maped to "Leadership".
       Example 3: "Personal Growth","Personal Development","Self Improvement" can be mapped to "Self Improvement"
    2. Each tag should follow title case convention. example: "Career Growth", "Leadership"
    3. Output should be a JSON object.No preamble.
    4. Output should have mapping of orginal tag with the unified tag.
       For example: {{"Career Growth":"Career Development","Career Development":"Career Development","Lead without control":"Leadership","Lift your team":"Leadership"}} 
       
    Here is the list of tags
    {tags}'''
    pt=PromptTemplate.from_template(template)
    chain=pt | llm
    response=chain.invoke(input={'tags':str(unique_tags_list)})
    try:
        json_parser=JsonOutputParser()
        res=json_parser.parse(response.content)
    except OutputParserException:
        raise OutputParserException("Context is too big. Unable to parse jobs.")
    
    return res
            
def extract_metadata(post):
    template='''
    You are given a LinkedIn post. You need to extract number of lines,language and tags of the post 
    1. Return a valid JSON. NO preamble.
    2. JSON object should have exactly three keys: line_count,language and tags.
    3. tags is an array of text tags. Extract maximum two tags. Don't include Hashtags before the tag word. Each tag should depict main topic of the post.
    4. Language should be English.
    here is the actual post on which you need to perform this task:
    {abc}
    '''
    pt=PromptTemplate.from_template(template)
    chain=pt | llm # supplying this template to that llm
    response = chain.invoke(input={'abc':post})
    try:
        json_parser=JsonOutputParser()
        res=json_parser.parse(response.content)
    except OutputParserException:
        raise OutputParserException("Context too big. Unable to parse jobs.")
    
    return res
if __name__=="__main__":
    process_posts("data/raw_posts.json","data/processed_posts.json")