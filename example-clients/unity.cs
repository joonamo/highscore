// This example Unity client was used in Unstables https://github.com/joonamo/unstables/)
// Provided here under BSD 2-Clause License

// BSD 2-Clause License

// Copyright (c) 2021, Joona Heinikoski
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Security.Cryptography;

[System.Serializable]
public class ScoreEntry
{
    public string id;
    public string time;
    public string player;
    public int score;
    public string gameId;
}

[System.Serializable]
public class ScoreList
{
    public ScoreEntry[] scores;
}

[System.Serializable]
public class ScorePost {
    public string player;
    public int score;
    public string time;
    public string validation;
}

public class ScoreService : MonoBehaviour
{
    // local example
    string baseUrl = "http://localhost:3000";
    string gameId = "d33491cd-ecbd-4405-8b0a-dc89baab0893";
    string secret = "secret";

    public string playerName = "Player";
    public ScoreList scores = new ScoreList();

    public GameManager gm;

    // Start is called before the first frame update
    void Start()
    {
        RefreshScores();
        gm = GameManager.GetGameManager();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void RefreshScores()
    {
        StartCoroutine(GetScores());
    }

    public void ReportScore(int score)
    {
        StartCoroutine(PostScore(makeScorePost(score)));
    }

    public void ReportName(string newName) {
        playerName = newName;
    }

    IEnumerator GetScores()
    {
        UnityWebRequest req = UnityWebRequest.Get(baseUrl + "/game/" + gameId + "/scores?perPlayer=true");
        yield return req.SendWebRequest();

        if (req.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(req.error);
        }
        else
        {
            // Show results as text
            Debug.Log(req.downloadHandler.text);
            // Not hacky at all
            scores = JsonUtility.FromJson<ScoreList>("{\"scores\":" + req.downloadHandler.text + "}");
            foreach (var score in scores.scores) {
                Debug.Log(score.player + ": " + score.score);
            }

            gm.ReportHighScoresAvailable();
        }
    }

    IEnumerator PostScore(ScorePost score)
    {
        WWWForm form = new WWWForm();
        form.AddField("player", score.player);
        form.AddField("score", score.score);
        form.AddField("time", score.time);
        form.AddField("validation", score.validation);
 
        UnityWebRequest req = UnityWebRequest.Post(baseUrl + "/game/" + gameId + "/score", form);

        yield return req.SendWebRequest();

        if (req.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(req.error);
        }

        RefreshScores();
    }

    public ScorePost makeScorePost(int score) {
        ScorePost post = new ScorePost();
        post.player = playerName;
        post.score = score;
        post.time = System.DateTime.Now.ToString("o");

        string toValidate = $"{gameId}-{score}-{playerName}-{post.time}-{secret}";
        Debug.Log(toValidate);
        var encoding = new System.Text.UTF8Encoding();
        byte[] validateBytes = encoding.GetBytes(toValidate);
        byte[] hash = ((HashAlgorithm) CryptoConfig.CreateFromName("MD5")).ComputeHash(validateBytes);
        post.validation = System.BitConverter.ToString(hash).Replace("-", string.Empty).ToLower();

        return post;
    }

}
