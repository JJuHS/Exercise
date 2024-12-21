package com.example.myapplication

import android.os.Bundle
import android.provider.CalendarContract.Instances
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

import android.widget.TextView;
import android.widget.Button;

import android.view.View;
import android.util.Log;
import kotlinx.coroutines.selects.select

import android.app.AlertDialog
import android.app.Dialog
import android.content.DialogInterface

import android.os.Handler

class MainActivity : AppCompatActivity() {
    var questionTextView: TextView? = null
    var example1Button: Button? = null
    var example2Button: Button? = null
    var example3Button: Button? = null
    var example4Button: Button? = null

    var TAG = "MainActivity"
    // problems 배열 만들기
    var problems = arrayOf(
        mapOf("question" to "1 + 2 = ?",
            "answer" to "3",
            "example1" to "1",
            "example2" to "3",
            "example3" to "2",
            "example4" to "4"),
        mapOf("question" to "3 + 2 = ?",
            "answer" to "5",
            "example1" to "4",
            "example2" to "6",
            "example3" to "5",
            "example4" to "2"),
        mapOf("question" to "3 + 3 = ?",
            "answer" to "6",
            "example1" to "6",
            "example2" to "1",
            "example3" to "5",
            "example4" to "4"),
        mapOf("question" to "0 + 3 = ?",
            "answer" to "3",
            "example1" to "1",
            "example2" to "2",
            "example3" to "4",
            "example4" to "3"),
        mapOf("question" to "4 + 2 = ?",
            "answer" to "6",
            "example1" to "6",
            "example2" to "4",
            "example3" to "2",
            "example4" to "5"),
        mapOf("question" to "5 + 4 = ?",
            "answer" to "9",
            "example1" to "8",
            "example2" to "6",
            "example3" to "7",
            "example4" to "9"),
        mapOf("question" to "4 + 4 = ?",
            "answer" to "8",
            "example1" to "7",
            "example2" to "1",
            "example3" to "8",
            "example4" to "3"),
        mapOf("question" to "2 + 5 = ?",
            "answer" to "7",
            "example1" to "7",
            "example2" to "1",
            "example3" to "5",
            "example4" to "4"),
        mapOf("question" to "1 + 4 = ?",
            "answer" to "5",
            "example1" to "4",
            "example2" to "5",
            "example3" to "0",
            "example4" to "6"),
        mapOf("question" to "3 + 1 = ?",
            "answer" to "4",
            "example1" to "8",
            "example2" to "3",
            "example3" to "4",
            "example4" to "0")
    )

    var problemNumber = 1
    var question = ""
    var answer = ""
    var example1 = ""
    var example2 = ""
    var example3 = ""
    var example4 = ""

    var totalCorrect = 0
    var totalCorrectTextView: TextView? = null
    var correctIncorrectTextView: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        questionTextView = findViewById(R.id.questionTextView)
        example1Button = findViewById(R.id.example1Button)
        example2Button = findViewById(R.id.example2Button)
        example3Button = findViewById(R.id.example3Button)
        example4Button = findViewById(R.id.example4Button)

        totalCorrectTextView = findViewById(R.id.totalCorrectTestView)
        correctIncorrectTextView = findViewById(R.id.correctIncorrectTextView)

        showProblem()

        totalCorrectTextView?.text = "Total Correct: 0"
        correctIncorrectTextView?.text = "Correct / Incorrect"
    }

    fun showProblem() {
        question = problems[problemNumber - 1]["question"]!!
        answer = problems[problemNumber - 1]["answer"]!!
        example1 = problems[problemNumber - 1]["example1"]!!
        example2 = problems[problemNumber - 1]["example2"]!!
        example3 = problems[problemNumber - 1]["example3"]!!
        example4 = problems[problemNumber - 1]["example4"]!!

        questionTextView?.text = question
        example1Button?.text = example1
        example2Button?.text = example2
        example3Button?.text = example3
        example4Button?.text = example4
    }

    fun example1ButtonClicked(v: View) {
        Log.d(TAG, "example1ButtonClicked")
        selectExample(example1)
    }
    fun example2ButtonClicked(v: View) {
        Log.d(TAG, "example2ButtonClicked")
        selectExample(example2)
    }
    fun example3ButtonClicked(v: View) {
        Log.d(TAG, "example3ButtonClicked")
        selectExample(example3)
    }
    fun example4ButtonClicked(v: View) {
        Log.d(TAG, "example4ButtonClicked")
        selectExample(example4)
    }

    fun selectExample(example: String) {
        Log.d(TAG, example)

        if (answer.equals(example)) {
            totalCorrect += 1
            totalCorrectTextView?.text = Integer.toString(totalCorrect)
            correctIncorrectTextView?.text = "Correct"
        } else {
            correctIncorrectTextView?.text = "Incorrect"
        }

        example1Button?.setEnabled(false)
        example2Button?.setEnabled(false)
        example3Button?.setEnabled(false)
        example4Button?.setEnabled(false)
        val h = Handler()
        h.postDelayed({
            example1Button?.setEnabled(true)
            example2Button?.setEnabled(true)
            example3Button?.setEnabled(true)
            example4Button?.setEnabled(true)

            if (problemNumber < problems.size) {
                problemNumber += 1
                showProblem()
            }
            else {
                Log.d(TAG, "showGameOverBox")
                showGameOverBox()
            }
        }, 1000)
    }

    fun showGameOverBox() {
        var alertDialog = AlertDialog.Builder(this)
            .setTitle("게임 종료")
            .setMessage("게임 재시작")
            .setNegativeButton("앱 종료", DialogInterface.OnClickListener{
                dialog, id -> exitApp()
            })
            .setPositiveButton("다시 하기", DialogInterface.OnClickListener{
                dialog, id -> replay()
            })
            .setCancelable(false)
            .create()
        alertDialog.show()
    }

    fun exitApp() {
        finishAffinity()
    }

    fun replay() {
        problemNumber = 1
        totalCorrect = 0

        showProblem()

        totalCorrectTextView?.text = "Total Correct: 0"
        correctIncorrectTextView?.text = "Correct / Incorrect"
    }
}
