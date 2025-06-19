import json
import pandas as pd
class Few_Shots:
    def __init__(self,filepath="data/processed_posts.json"):
        self.df=None
        self.unique_tags=None
        self.load_posts(filepath)
        print(self.df)
        print(self.unique_tags)

    
    def load_posts(self,filepath):
        with open(filepath,encoding='utf-8') as f:
            posts=json.load(f)
            df=pd.json_normalize(posts)
            df['length']=df['line_count'].apply(self.categorize_length)
            all_tags=df['tags'].apply(lambda x:x).sum() # it adds every ele of each array to single array
            self.unique_tags=set(list(all_tags))# for removing dup tags
            self.df=df
        pass

    def categorize_length(self,linecount):
        if linecount<5:
            return "Short"
        elif linecount>=5 and linecount<10:
            return "Medium"
        else:
            return "Long"
    
    
    def get_tags(self):
        return self.unique_tags
    
    def get_filtered_posts(self,length,language,tag):
        df_filtered=self.df[
            (self.df['length']==length) &
            (self.df['language']==language) &
            (self.df['tags'].apply(lambda tags:tag in tags))
        ]
        return df_filtered.to_dict(orient="records") # this ensure we have dataframe converted into list of dicts(orient='records')

if __name__=="__main__":
    fs=Few_Shots()
    posts=fs.get_filtered_posts("Medium","English","Job Search")
    print(posts)