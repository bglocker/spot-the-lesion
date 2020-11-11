#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <utility>
#include <algorithm>
#include <stdio.h>
#include <string.h>

#define NO_OF_FILES 4723

using namespace std;

bool cmp(pair<int,int> a, pair<int, int> b) {
    return a.second <= b.second;
}

vector<pair<int, int>> tableOfImages;

int main()
{
    for(int i = 0; i < NO_OF_FILES; i++)
    {
        string filePath = "content/annotation/";
        filePath.append(to_string(i));
        filePath.append(".json");
        ifstream fin(filePath);
        string x;
        fin>>x;
        char c;
        fin.get(c);
        fin.get(c);
        int x1,y1,x2,y2;
        fin>>x1;
        fin.get(c);
        fin>>y1;
        fin.get(c);
        fin>>x2;
        fin.get(c);
        fin>>y2;

        tableOfImages.push_back(make_pair(i, (x2 - x1) * (y2 - y1)));
    }

    sort(tableOfImages.begin(), tableOfImages.end(), cmp);


    for(int i = 0; i < NO_OF_FILES; i++){
        int j = 0;
        while(tableOfImages[j].first != i)
            j++;


        {
            string filePath = "content/annotation/";
            filePath.append(to_string(i));
            filePath.append(".json");

            int n1 = filePath.length();
            char oldPath[n1 + 1];
            strcpy(oldPath, filePath.c_str());

            string newFilePath = "content/annotation/new";
            newFilePath.append(to_string(j));
            newFilePath.append(".json");

            int n2 = newFilePath.length();
            char newPath[n2 + 1];
            strcpy(newPath, newFilePath.c_str());

            rename(oldPath, newPath);
        }

        {
            string filePath = "content/images/";
            filePath.append(to_string(i));
            filePath.append(".png");

            int n1 = filePath.length();
            char oldPath[n1 + 1];
            strcpy(oldPath, filePath.c_str());

            string newFilePath = "content/images/new";
            newFilePath.append(to_string(j));
            newFilePath.append(".png");

            int n2 = newFilePath.length();
            char newPath[n2 + 1];
            strcpy(newPath, newFilePath.c_str());

            rename(oldPath, newPath);
        }
    }

    for(int i = 0; i < NO_OF_FILES; i++){
        {
            string filePath = "content/annotation/new";
            filePath.append(to_string(i));
            filePath.append(".json");

            int n1 = filePath.length();
            char oldPath[n1 + 1];
            strcpy(oldPath, filePath.c_str());

            string newFilePath = "content/annotation/";
            newFilePath.append(to_string(i));
            newFilePath.append(".json");

            int n2 = newFilePath.length();
            char newPath[n2 + 1];
            strcpy(newPath, newFilePath.c_str());

            rename(oldPath, newPath);
        }

        {
            string filePath = "content/images/new";
            filePath.append(to_string(i));
            filePath.append(".png");

            int n1 = filePath.length();
            char oldPath[n1 + 1];
            strcpy(oldPath, filePath.c_str());

            string newFilePath = "content/images/";
            newFilePath.append(to_string(i));
            newFilePath.append(".png");

            int n2 = newFilePath.length();
            char newPath[n2 + 1];
            strcpy(newPath, newFilePath.c_str());

            rename(oldPath, newPath);
        }
    }

    return 0;
}
